import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { PageDoc_Team } from 'projects/redmond-fire-library/src/lib/models/docs';
import { TeamCardDialogComponent } from './team-card-dialog/team-card-dialog.component';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';


@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styles: [`
    :host {
            [card-image] {
                    @apply overflow-hidden !important;
            }
            ::ng-deep {
              .card-content {
                padding: 0 !important;
              }
            }
    }
  `]
})
export class TeamCardComponent implements OnInit {

  @Input() doc: PageDoc_Team

  funcs = FUNCS
  viewing

  constructor(public elemRef: ElementRef, private dialog:MatDialog, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
  }

  setViewing(val) {
    this.viewing = val === this.viewing ? null : val;
    if (!!!this.viewing) return;
    return FUNCS.setTimeout$(() => {
      const maxW = '640px';
      const elem = this.elemRef.nativeElement.querySelector('.view-teammate');
      const dialogData: any = {
        width: 'calc(100vw - 1em)',
        maxWidth: '640px',
        minHeight: '380px',
        maxHeight: '90vh',
        backdropClass: 'view-teammate-dialog-backdrop',
        panelClass: 'view-teammate-dialog',
        closeOnNavigation: true,
        autoFocus: false,
        data: { doc: this.viewing }
      };
      if (!!elem) {
        dialogData.position = this.funcs.dialogPositioning(elem);
        if (!!dialogData.position.top) dialogData.position.top = '20px';
        if (parseInt(dialogData.position.top) + 20 > 0) {
          this.funcs.scrollTo({ elem, blockPosition: 'start', delay: 400 })
        }
      }
      
      const dialogRef = this.dialog.open(TeamCardDialogComponent, dialogData);
      dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
        this.viewing = null;
        this.route.paramMap.pipe(take(1)).toPromise().then((paramMap:any) => {
          if(paramMap?.params?.page === 'team')
            this.location.go('/team');
        });
      });
      this.funcs.scrollTo({ elem, blockPosition: 'center' });
    }, 100)
  }

}
