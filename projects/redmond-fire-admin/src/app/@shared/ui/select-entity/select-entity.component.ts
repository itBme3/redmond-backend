import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COLLECTION_TYPE_FROM_SINGULAR} from 'projects/redmond-fire-library/src/lib/models/collections';
import { DbQueryObject } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { SiteEntityCollectionType } from 'projects/redmond-fire-library/src/lib/models/docs';
import { SelectEntityInputData } from '../../../models/selecting';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';


@Component({
  selector: 'app-select-entity',
  templateUrl: './select-entity.component.html',
  styleUrls: ['./select-entity.component.scss']
})
export class SelectEntityComponent implements OnInit {

  @Input() data: SelectEntityInputData

  query: DbQueryObject = {}
  collections: string[] = Object.values(SiteEntityCollectionType);
  changingCollection: boolean = false
  search: string = ''
  items: any[] = [];
  openPanel: boolean = true
  collection: SiteEntityCollectionType = SiteEntityCollectionType.PROJECTS;
  entityCollectionTypes = Object.values(SiteEntityCollectionType);

  @Output() public selectionUpdated = new EventEmitter<any[]>()
  @Output() public saved = new EventEmitter<any[] | null>()

  constructor() { }

  ngOnInit(): void {
    if (!!this.data.collectionType && !!!this.collection) this.collection = this.data.collectionType;
    if (!!!this.data.collections || this.data.collections.length === 0)
      this.data.collections = !!this.data.collection ? [this.data.collection, ...this.entityCollectionTypes.filter(c => c !== this.data.collection)] : this.entityCollectionTypes;
    ['query', 'selected', 'collection', 'collections']
      .forEach(key =>
        !!this.data[key] ? this[key] = this.data[key] : '');
    this.query = this.data.query;

  }

  getPath(entityType) {
    const path = !!this.data?.path ? this.data.path : `admin/${COLLECTION_TYPE_FROM_SINGULAR[entityType]}/collection`;
    return path
  }

  setCollection(entityType) {
    this.changingCollection = true;
    this.items = []
    this.data.collection = entityType;
    setTimeout$(() => {
      this.changingCollection = false;
    }, 500)
  }

  get scrollHeight() {
    return !!this.data?.scrollHeight ? this.data.scrollHeight : 'calc(100% - 60px)'
  }

  set selected(val) {
    this.data.selected = val;
    this.selectionUpdated.emit(this.data.selected)
  }

  get selected() {
    return !!this.data?.selected && Array.isArray(this.data.selected) ? this.data.selected : []
  }

  setItems(items) {
    this.items = items;
  }

  selectItem(itm_or_indx: any) {

    if (typeof itm_or_indx === 'number')
      return this.selected.splice(itm_or_indx, 1)

    if (this.selected.map(d => d.docPath).includes(itm_or_indx.docPath))
      return;

    this.selected = [...this.selected, itm_or_indx];
  }

  getSearchData(path) {
    return {
      path,
      type: this.collection.substr(0, this.collection.length - 1),
      query: this.query,
      search: '',
      searchField: 'title',
      showFilters: false,
      noFilters: true,
      selecting: true,
    }
  }

}



/*
---------------------------------------
COMPONENT: DIALOG
---------------------------------------
*/

@Component({
  templateUrl: `./select-entity-dialog.component.html`,
  styles: [``]
})
export class SelectEntityDialogComponent implements OnInit {
  
  data: SelectEntityInputData = {
    query: { limit: 10 },
    selected: [],
    collections: Object.values(SiteEntityCollectionType),
  }

  showSelected = true;

  
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) data) {
    this.data = { ...this.data, ...data };
  }

  ngOnInit() { }

  
  
  save(selection) {
    this.data.selected = selection;
    this.dialogRef.close(selection)
  }

}