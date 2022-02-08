import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav'
import { DbQueryObject, DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { Subscription, Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { SiteContentService } from '../../../services/site-content.service';
import { DbSearchComponent } from '../db-search/db-search.component';

@Component({
  selector: 'app-select-media',
  templateUrl: './select-media.component.html',
  styleUrls: ['./select-media.component.scss'],
  inputs: ['inputData']
})
export class SelectMediaComponent implements OnInit {

  @Input() inputData: {
    searchData?: { query: DbQueryObject, path: string }
    source?: 'firebase' | 'upload';
    selected?: any[];
    multiple?: boolean;
  }

  @Output() submitSelection = new EventEmitter<any>();
  @Output() cancelSelection = new EventEmitter<any>();

  @ViewChild('sideNav') sideNav: MatSidenav;
  @ViewChild('dbSearch') dbSearch: DbSearchComponent;

  showSelected: boolean = false
  breakpointSubscription: Subscription
  isHandset$: Observable<boolean>
  searchData = { query: { limit: 20, orderBy: 'createdAt,desc' }, path: 'uploads', externalSearch: true }
  data: any
  dataKey: string
  removing: number = null;
  
  constructor(
    private db: DbService,
    private breakpointObserver: BreakpointObserver,
    private cloudFunctions: AngularFireFunctions,
    private uiService: UiService,
    public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public dialogData) {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }


  ngOnInit(): void {
    this.data = !!this.dialogData ? this.dialogData : this.inputData
    this.dataKey = !!this.dialogData ? 'dialogData' : !!this.inputData ? 'inputData' : null;
    this.data.multiple = !!this[this.dataKey]?.multiple;
    if (!Array.isArray(this[this.dataKey]?.selected))
      this.data.selected = Array.isArray(this[this.dataKey].selected) ? this[this.dataKey].selected : [];
    this.data.source = !!this.data?.source ? this.data.source : 'firebase'
    this[this.dataKey].source = this.data.source;
    if (!!!this.data?.searchData) this.data.searchData = {};
    this.searchData = { ...this.searchData, ...this.data.searchData };
    this.data.selected = !!this.data?.selected && Array.isArray(this.data.selected) ? this.data.selected : []
    this.showSelected = this.data.selected.length > 0;
  }


  resetSizing() {
    return setTimeout$(() => {
      this.uiService.triggerSizeReset();
    }, 500);
  }

  set selectedMedia(selected) {
    if (!!!this.data) this.data = {};
    if (!!!this.inputData) this.inputData = {};
    this.data.selected = selected;
    this.inputData.selected = selected;
      if (!!!this.data.multiple) this.emitSelection();
  }

  get selectedMedia() {
    return this[this.dataKey].selected
  }

  set source(source) {
    this[this.dataKey].source = source;
  }

  uploadTaskCallback(doc) {
    this.addMediaSelection(doc);
    this.sideNav.open()
  }

  addMediaSelection(doc) {
    if (!this[this.dataKey].selected.map(d => d.docId).includes(doc.docId))
      this.selectedMedia = [...this[this.dataKey].selected, doc];
  }

  async updateMediaSelection(docs) {
    this.selectedMedia = docs
    if (!!!this.data.multiple) return this.emitSelection();
    this.dbSearch.filteredDocsSubject.next(null)
    return this.selectedMedia
  }

  async createMediaDoc(data) {
    return await this.db.updateAt('uploads', data).catch(console.error)
  }

  removeItem(indx) {
    this[this.dataKey].selected.splice(indx, 1);
    this.selectedMedia = this[this.dataKey].selected;
    this.dbSearch.filteredDocsSubject.next(null);
  }

  emitSelection() {
    this.submitSelection.emit(!!this.data.multiple ? this[this.dataKey].selected : this[this.dataKey].selected[0])
    !!this.dialogRef?.close ?
      this.dialogRef.close(!!this.data.multiple ? this[this.dataKey].selected : this[this.dataKey].selected[0])
      : null
  }

  cancel() {
    return !!this.dialogRef?.close ?
      this.dialogRef.close()
      : this.cancelSelection.emit(true)
  }

  updatingSearch(event) {
    this.searchData = event;
  }
  

}


/*
---------------------------------------
COMPONENT: DIALOG
---------------------------------------
*/
@Component({
  template: `
    <app-select-media
      [searchData]="searchData"
      (submitSelection)="closeDialog($event)"
      (cancelSelection)="closeDialog($event)">
    </app-select-media>
  `
})
export class SelectMediaDialogComponent implements OnInit {

  searchData = {
    query: { limit: 10, orderBy: 'updatedAt,desc' },
    path: 'uploads'
  }

  constructor(
    public dialogRef: MatDialogRef<any>
  ) {

  }

  ngOnInit() {

  }

  closeDialog(e) {
    this.dialogRef.close(e)
  }

}