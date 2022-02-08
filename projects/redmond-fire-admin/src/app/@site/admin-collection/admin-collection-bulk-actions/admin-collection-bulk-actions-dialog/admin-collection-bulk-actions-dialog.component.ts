import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { CollectionType, COLLECTION_TYPE_SINGULAR,  } from 'projects/redmond-fire-library/src/lib/models/collections';
import { tap } from 'rxjs/operators';

export type ConfirmColors = 'darken' | 'green' | 'yellow' | 'red';
interface DataParams { selected: { docId: string;[key: string]: any }[], action: string, collection: CollectionType };

@Component({
  selector: 'app-admin-collection-bulk-actions-dialog',
  templateUrl: './admin-collection-bulk-actions-dialog.component.html',
  styleUrls: ['./admin-collection-bulk-actions-dialog.component.scss']
})
export class AdminCollectionBulkActionsDialogComponent implements OnInit {

  selected: any[]
  action: string
  value: any
  updatedCount: number = 0
  confirmSaveMessage: {title: string, items: string} | null = null
  updating: boolean = false
  collection: CollectionType
  confirmColor: ConfirmColors = 'green'
  // @ViewChild('')

  constructor(
    private db: DbService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) data: DataParams,
  ) {
    const { selected = null, action = null, collection } = data;
    this.selected = selected;
    this.action = action;
    this.collection = collection;
  }

  ngOnInit() {
    
    if (this.action === 'delete')
        return this.confirmSave();
  }

  executeAction() {
    const _this = this;
    const simpleUpdate = async (key, value = this.value, confirmColor: ConfirmColors = 'green') => {
      try {
        if (!!!this.value) return;
        _this.confirmColor = confirmColor
        return await Promise.all(this.selected.map(async doc =>
          await this.db.updateAt(doc.docPath, { [key]: value })
            .then(updatedDoc => {
              this.updatedCount++
              return updatedDoc
            }).catch(err_1 => { throw new Error(err_1.message) })
        )).then(docs => this.dialogRef.close(docs));
      } catch (errs) {
        console.error(errs.message);
        throw new Error(errs.message)
      }
    }
    const actions = {
      'update category': async () => {
        return await simpleUpdate('category');
      },
      'update sector': async () => {
        return await simpleUpdate('sector');
      },
      'update status': async () => {
        if (!!!this.value || !(['published', 'draft', 'archived', 'hidden'].includes(this.value))) return;
        const statusColors = { published: 'green', draft: 'yellow', archived: 'red', hidden: 'darken' };
        _this.confirmColor = statusColors[this.value];
        return await Promise.all(this.selected.map(async doc => 
          await this.db.updateAt(doc.docPath, { status: this.value })
            .then(updatedDoc => {
              this.updatedCount++
              return updatedDoc
            }).catch(err => console.error(err))
        )).then(docs => this.dialogRef.close(docs))
          .catch(err => { console.error(err); return null })
      },
      'delete': async () => {
        _this.confirmColor = 'red'
        return await Promise.all(this.selected.map(async doc => 
          await this.db.delete(doc.docPath).catch(err => console.error(err))
        )).then(() => this.dialogRef.close(this.selected))
          .catch(err => { console.error(err); return null })
      }
    }
    return actions[this.action]()
      .then(() => this.confirmationSnack())
      .catch(console.error)
  }
  

  confirmSave() {
    if (!!!this.value) this.value = [];
    if (this.value.length === 0 && this.action !== 'delete') return;
    const itemTitle = `${COLLECTION_TYPE_SINGULAR[this.collection]}${this.collection === 'team' ? ' member' : ''}${this.selected.length > 1 ? 's' : ''}`;
    this.confirmColor = ['delete'].includes(this.action) || this.value === 'archived' ? 'red'
      : ['update category', 'update sector'].includes(this.action) ||  this.value === 'published' ? 'green' : this.value === 'draft' ? 'yellow'
        : 'darken'
    const actionWording = {
      'update category': `Updating category to <strong class="text-${this.confirmColor}">${this.value}</strong><!--split-->on <strong>${this.selected.length}</strong> ${itemTitle}`,
      'update sector': `Updating sector to <strong class="text-${this.confirmColor}">${this.value}</strong><!--split-->on <strong>${this.selected.length}</strong> ${itemTitle}`,
      'update status': `Updating status to <strong class="${this.confirmColor === 'darken' ? `text-gray-400` : `text-${this.confirmColor}`}">${this.value}</strong><!--split-->for <strong>${this.selected.length}</strong> ${itemTitle}`,
      'delete': `<span class="text-grey-light">deleting <strong class="text-red">${this.selected.length}</strong> ${itemTitle}</span>`
    }
    return this.confirmSaveMessage = {
      title: actionWording[this.action],
      items: `<ol style="max-height: 200px" class="overflow-scroll mx-auto ${this.confirmColor === 'darken' ? 'text-lighten-07' : `text-light-${this.confirmColor}`}">
          ${this.selected.map(doc => `<li>${!!doc.title ? doc.title : !!doc.name ? doc.name : doc.docId}</li>`).join('')}
        </ol>
      `,
    }
  }

  confirmationSnack() {
    const itemTitle = `${COLLECTION_TYPE_SINGULAR[this.collection]}${this.collection === 'team' ? ' member' : ''}${this.selected.length > 1 ? 's' : ''}`;
    let messages = {
      'update category': `updated category to ${this.value} on ${this.updatedCount} ${itemTitle}`,
      'update sector': `updated sector to ${this.value} on ${this.updatedCount} ${itemTitle}`,
      'update status': `updated status of ${this.updatedCount} ${itemTitle} to ${this.value}`,
      'delete': `deleted ${this.selected.length} ${itemTitle}`
    }
    this.snackBar.open(messages[this.action], '👍', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'snack-message-dark'
    });
    this.snackBar._openedSnackBarRef.afterDismissed()
      .pipe(tap(_ => { this.confirmSaveMessage = null; this.updatedCount = 0; this.selected = []}))
      .subscribe();
    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(tap(_ => {this.confirmSaveMessage = null; this.updatedCount = 0; this.selected = []}))
      .subscribe();
  }

}