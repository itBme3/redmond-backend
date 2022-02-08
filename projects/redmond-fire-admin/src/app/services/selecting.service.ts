import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dialogPositioning } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { COLLECTION_DOC_ADMIN_PATH } from 'projects/redmond-fire-library/src/lib/models/collections';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SelectCollectionTypeComponent } from '../@shared/ui/select-entity/select-entity-type/select-collection-type.component';
import { SelectEntityDialogComponent } from '../@shared/ui/select-entity/select-entity.component';
import { SelectMediaDialogComponent } from '../@shared/ui/select-media/select-media.component';
import { SelectEntityInputData } from '../models/selecting';

@Injectable({
      providedIn: 'root'
})
export class SelectingService {

      subscriptions: Subscription[] = []

      constructor(public dialog: MatDialog) { }

      selectEntity(
            data: SelectEntityInputData, callback: Function) {
            if (!!!data?.path && !!!data?.collection)
                  return this.chooseCollectionType({ elem: data.elem, selectEntityAfterChoice: true, data }, callback)
            
            const dialogData: any = {
                  maxWidth: typeof data?.maxWidth === 'string' ? data.maxWidth : '640px',
                  height: '80vh',
                  width: '80vw',
                  backdropClass: 'bg-transparent',
                  closeOnNavigation: true,
                  panelClass: 'select-entity-dialog',
                  autoFocus: false,
                  data
            }
            const dialogRef = this.dialog.open(SelectEntityDialogComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).subscribe(async (options) =>
                  !!options && !!callback ? callback(options) : ''
            );
      }

      chooseCollectionType(params: { elem?: any; selectEntityAfterChoice?: boolean; data?: SelectEntityInputData; searchAdminDocs?: boolean}, callback: Function) {
            
            const { elem = null, searchAdminDocs = true, selectEntityAfterChoice = true, data = {} } = params;
            const dialogData: any = {
                  maxWidth: typeof data?.maxWidth === 'string' ? data.maxWidth : '180px',
                  height: 'auto',
                  width: '80vw',
                  backdropClass: 'bg-transparent',
                  closeOnNavigation: true,
                  panelClass: 'select-entity-type-dialog',
                  autoFocus: false,
                  data: { data }
            }
            if(!!elem) dialogData.position = dialogPositioning(elem, dialogData.maxWidth )
            const dialogRef = this.dialog.open(SelectCollectionTypeComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).subscribe(async (collection) => {
                  if (!!!collection) return;
                  if (!!!selectEntityAfterChoice) {
                        if (!!callback) return callback(collection);
                        return collection;
                  }
                  const path = searchAdminDocs || !!!COLLECTION_DOC_ADMIN_PATH[collection].includes('admin') ?
                        COLLECTION_DOC_ADMIN_PATH[collection] :
                        COLLECTION_DOC_ADMIN_PATH[collection].replace('admin', '');
                  if (!!!collection && !!!path) return;
                  return !!collection && !!callback ?
                        this.selectEntity({ ...data, path, collection, collections: [collection], searchData: { noFilters: true } }, callback) : '';
            });
      }

      selectMedia(
            params: {
                  elem?, dialogParams?: { [key: string]: any }
                  componentParams?: { [key: string]: any },
            }, callback: Function) {
            const { componentParams = {}, elem = null } = params;
            let { dialogParams = {} } = params;
            const dialogDefaults = {
                  width: 'calc(100vw - 2em)',
                  maxWidth: 'calc(100vw - 2em)',
                  height: 'calc(100vh - 2em)',
                  maxHeight: 'calc(100vh - 2em)',
                  position: { top: '1em', left: '1em' },
                  panelClass: 'select-media-dialog' 
            };
            // if (!!!dialogParams) dialogParams = {};
            Object.keys(dialogDefaults).forEach(key => !!!dialogParams[key] ? dialogParams[key] = dialogDefaults[key] : '');
            const dialogData: any = {
                  data: {
                        searchData: {
                              noFilters: true,
                              externalSearch: true,
                              selecting: true,
                              path: 'uploads'
                        },
                        ...componentParams
                  },
                  ...dialogParams
            }
            if(!!elem && !!!dialogData?.position) dialogData.position = dialogPositioning(elem, dialogParams?.maxWidth ? dialogParams.maxWidth : '960px')
            const dialogRef = this.dialog.open(SelectMediaDialogComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).toPromise()
                  .then(res => {
                        if (!!res && !!callback) callback(res);
                        return
                  })
      }

}