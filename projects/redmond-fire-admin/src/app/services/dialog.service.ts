import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { dialogPositioning } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { AsyncSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SimpleDialogComponent } from '../@shared/ui/simple-dialog/simple-dialog.component';



@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private db: DbService) { }

  open(params: { component, componentParams?, elem?, dialogParams?, forceCallback? }, callback:Function = null) {
    const { component, componentParams = {}, elem = null, dialogParams = { maxWidth: 'calc(100vw - 2em)', maxHeight: 'calc(100vh - 2em)' }, forceCallback = false } = params;
    const dialogData = { ...dialogParams, data: componentParams }
    if (!!elem) dialogData.position = dialogPositioning(elem, !!dialogParams.maxWidth ? dialogParams.maxWidth : null);
    const dialogRef = this.dialog.open(component, dialogData);
    dialogRef.afterClosed().pipe(take(1)).subscribe((submitted: any) => {
      if (!!!callback) return;
      if (!!!submitted && !!!forceCallback) return;
      return !!callback ? callback(submitted) : null;
    });
  }
  
 

  confirmButton(params: { elem, buttonClasses?, buttonColor?, dialogParams?: { [key: string]: any } }, callback: Function) {
        const { buttonColor="red" } = params;
        const { elem = null, buttonClasses = `bg-${buttonColor}-500 text-white hover:bg-${buttonColor}-600 text-sm text-uppercase`, dialogParams = { maxWidth: '100px', maxHeight: '300px' } } = params;
        const dialogData: { [key: string]: any } = {
              ...dialogParams, panelClass: 'only-button', backdropClass: 'bg-transparent', autoFocus: false,
              data: {
                    button: 'confirm',
                    classes: { button: buttonClasses },
                    onlyButton: true
              }
        };
        if (!!elem) dialogData.position = dialogPositioning(elem, !!dialogData.maxWidth ? dialogData.maxWidth : null);
        const dialogRef = this.dialog.open(SimpleDialogComponent, dialogData);
        dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: any) => {
          if (!!!shouldDelete) return;
          if (!!!callback) console.error('no callback provided');
          return callback()
        });
  }

  updateEntityStatus(params: { doc, status, elem?, confirmAction?}) {
    const { doc, status, elem = null, confirmAction = true } = params;
    const status$ = new AsyncSubject();
    if (!!!confirmAction) {
      this.db.updateAt(doc.docPath, { status }).catch(console.error);
      status$.next(status);
      status$.complete();
      return
    }
    this.confirmButton({ elem }, (res) => {
      if (!!!res) {
        status$.next(doc.status);
        return status$.complete();
      }
      this.db.updateAt(doc.docPath, { status }).catch(console.error);
      status$.next(status);
      status$.complete();
    });
    return status$;
  }


}



