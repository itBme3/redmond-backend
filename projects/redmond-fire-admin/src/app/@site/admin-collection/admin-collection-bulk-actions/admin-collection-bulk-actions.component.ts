import { Component, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { AdminCollectionBulkActionsDialogComponent } from './admin-collection-bulk-actions-dialog/admin-collection-bulk-actions-dialog.component';
import $ from 'jquery';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CollectionType } from 'projects/redmond-fire-library/src/lib/models/collections';

@Component({
  selector: 'app-admin-collection-bulk-actions',
  templateUrl: './admin-collection-bulk-actions.component.html',
  styleUrls: ['./admin-collection-bulk-actions.component.scss']
})
export class AdminCollectionBulkActionsComponent implements OnInit {

  @Input() selected: any[]
  @Input() collection: CollectionType
  @Input() collectionPath: string;
  
  @Output() public updateDocs = new EventEmitter<any>()
  @Output() public deletedDocs = new EventEmitter<string[]>()
  @Output() updateSelection = new EventEmitter<any>()

  actions: { [key: string]: string[] } = {
    posts:  ['update category', 'update status', 'delete'],
    projects:  [ 'update sector', 'update status', 'delete'],
    pages:  [ 'update status', 'delete'],
    team: ['delete', 'update status'],
    uploads: ['delete']
  }
  
  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    return this.route.data.pipe(take(1)).toPromise()
      .then(data => {
        const { collection = null } = data;
        const collectionPath = !!data?.searchData?.path ? data.searchData.path : null;
        this.collection = collection;
        this.collectionPath = collectionPath;
        return {  collection, collectionPath }
      }).catch(err => { console.error(err.message); return { collection: null, collectionPath: null } });
  }

  clearSelection() {
    this.updateSelection.emit([])
  }

  updatingDocs(updates) {
    this.updateDocs.emit(updates)
  }

  deletingDocs(updates) {
    this.deletedDocs.emit(updates.map(d => d.docPath))
    this.clearSelection();
  }

  async openDialog(action, elem) {
    const _this = this;
    const elemPosition = $(elem).offset();
    const windowWidth = $(window).width();
    const position:{ [key:string]: string | number } = {
      top: `${Math.ceil(elemPosition.top)}px`,
      left: elemPosition.left + 300 > windowWidth ? 'auto' : `${Math.ceil(elemPosition.left - 60)}px`,
    }
    if (position.left === 'auto') position['right'] = '20px';
    const dialogRef = this.dialog.open(AdminCollectionBulkActionsDialogComponent, {
      maxWidth: action === 'update status' ? '220px' : '280px',
      width: 'calc(100% - 1em)',
      backdropClass: 'bg-transparent',
      panelClass: 'microsite-bulk-actions',
      closeOnNavigation: true,
      hasBackdrop: true,
      data: { action, selected: this.selected, collection: this.collection, collectionPath: this.collectionPath },
      autoFocus: false,
      position,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((docs) => {
      if(!!docs && docs.length > 0){
        if (action === 'delete') return _this.deletingDocs(docs)
        _this.updatingDocs(docs)
      }
      return docs
      // this.clearSelection()
    });
  }
}