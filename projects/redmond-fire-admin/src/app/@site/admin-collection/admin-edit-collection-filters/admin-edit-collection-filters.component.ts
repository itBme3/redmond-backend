import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CollectionDoc, CollectionType } from 'projects/redmond-fire-library/src/lib/models/collections';
import { animatedList } from 'projects/redmond-fire-library/src/lib/constants/animations';
import { AdminCollectionService } from 'projects/redmond-fire-library/src/lib/services/admin-collections.service'
import { ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-edit-collection-filters',
  templateUrl: './admin-edit-collection-filters.component.html',
  styleUrls: ['./admin-edit-collection-filters.component.scss'],
  animations: animatedList
})
export class AdminEditCollectionFiltersComponent implements OnInit, OnDestroy {

  /* one or the other (not both) */
  @Input() collectionDoc: CollectionDoc;
  @Input() collectionType: CollectionType


  @Output() updated = new EventEmitter<any>()
  @Output() createItem = new EventEmitter<boolean>()

  updateSubject = new ReplaySubject()

  editingFilter: { key:string, index: number } = null
  removing: number = null
  subscriptions: Subscription[] = []

  confirmNewHandles: {
    [key: string /*filterKey*/]: {
      [key: string /* itemIndex as string */]: string /* value */;
    }
  } = {};

  drop(event: CdkDragDrop<any[]>, key) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.collectionDoc.filters[key] = event.container.data;
    this.updated.emit(this.collectionDoc);
  }

  collectionKeys


  constructor(private collectionService: AdminCollectionService) { }



  async ngOnInit() {
    if (!!!this.collectionDoc && !!this.collectionService.collectionDocs[this.collectionType])
      this.collectionDoc = await this.collectionService.collectionDocs[this.collectionType].pipe(take(1)).toPromise()
        .catch(err => { console.error(err.message); return null });
    this.collectionKeys = Object.keys(this.collectionDoc);
    return this.subscriptions.push(this.updateSubject
      .pipe(
        debounceTime(20),
        map((update: {filterKey:string, optionKey:string, itemIndex: number, value: string}) => {
          try {
            const { filterKey, itemIndex, optionKey, value } = update;
            if (
              !!!this.collectionDoc.filters[filterKey][itemIndex][optionKey] ||
              !!!this.collectionDoc.filters[filterKey][itemIndex][optionKey]
            ) return null;
            if (this.collectionDoc.filters[filterKey][itemIndex][optionKey] === value)
              return;
            this.collectionDoc.filters[filterKey][itemIndex][optionKey] = value;
            this.updated.emit(this.collectionDoc)
          } catch (errs) {
            console.error(errs.message)
          } finally {
            return update
          }
        })
    ).subscribe())
  }

  addItem(key) {
    if (!!!this.collectionDoc?.filters)
      this.collectionDoc.filters = {};
    if (!!!this.collectionDoc.filters[key])
      this.collectionDoc.filters[key] = [];
    this.collectionDoc.filters[key].push({ label: null, handle: null });
  }

  removeItem(filterKey, itemIndex) {
    if (!!!this.collectionDoc?.filters ||!!!this.collectionDoc?.filters[filterKey] || !!!this.collectionDoc?.filters[filterKey][itemIndex])
      return;
    this.collectionDoc.filters[filterKey].splice(itemIndex, 1);
    this.updated.emit(this.collectionDoc);
  }

  trackByFn(item, index) {
    return index
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }
  
}
