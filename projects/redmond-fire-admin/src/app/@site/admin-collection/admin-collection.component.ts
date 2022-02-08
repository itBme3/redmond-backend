import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DbFilterOptionType, DbQueryService } from 'projects/redmond-fire-library/src/lib/services/db-query.service';
import { animatedList } from 'projects/redmond-fire-library/src/lib/constants/animations';
import { CollectionDoc, CollectionType, ENTITY_TYPE_FROM_COLLECTION } from 'projects/redmond-fire-library/src/lib/models/collections';
import { PageDoc, SiteEntityType } from 'projects/redmond-fire-library/src/lib/models/docs';
import { AdminCollectionService } from 'projects/redmond-fire-library/src/lib/services/admin-collections.service';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { DbSearchInputData } from '../../@shared/ui/db-search/db-search.component';
import { ADMIN_COLORS } from 'projects/redmond-fire-library/src/lib/constants/admin-pages';
import { SiteContentService } from '../../services/site-content.service';
import { WindowRef } from 'projects/redmond-fire-library/src/lib/services/window-ref';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { DialogService } from '../../services/dialog.service';
import { AdminReorderingCollectionComponent } from './admin-reordering-collection/admin-reordering-collection.component';


export const DEFAULT_COLLECTION_SEARCH_DATA: DbSearchInputData = {
    path: '',
    search: '',
    searchField: 'title',
    externalSearch: true,
    searchFieldOptions: ['title', 'handle'],
    showFilters: false,
    externalFilters: true,
    externalDocs: true,
    query: { orderBy: 'updatedAt,desc', limit: 10 },
    setUrlParams: true,
  initParamsFromUrl: true,
    noFilters: true,
    filterOptionTypes: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS, DbFilterOptionType.CATEGORY, DbFilterOptionType.SECTOR],
  }

@Component({
  selector: 'app-admin-collection',
  templateUrl: './admin-collection.component.html',
  styleUrls: ['./admin-collection.component.scss'],
  animations: animatedList
})
export class AdminCollectionComponent implements OnInit, OnDestroy {

  @Input() searchData: DbSearchInputData = null
  @Input() displayData: {
    layout?: 'list' | 'cards' | string;
    titleField?: string;
    imageField?: string;
    textFields?: string[];
    showStatus?: boolean;
    showTags?: boolean;
  }
  @Input() collection: CollectionType;
  defaultSearchData = DEFAULT_COLLECTION_SEARCH_DATA
  defaultDisplayData = {
    layout: 'list',
    titleField: 'title',
    textFields: ['description', 'handle'],
    showStatus: true,
    showTags: true
  }
  
  
  hideFiltersForPaths: string[] = ['forms']

  isHandset$: Observable<boolean>
  onCardClick: Function | false = false
  showing_hiding_fields: boolean = false
  docs: PageDoc[] | 'loading';
  filteredDocs: PageDoc[];

  lastSelectedIndex: number = 0;
  selected: any[] = [];
  deleted: string[] = []
  currentPage:any
  
  showPageData: boolean = false
  entityType: SiteEntityType

  subscriptions: Subscription[] = []

  collectionDoc$: Observable<CollectionDoc | { [key:string]: any }>
  shellWrapper: boolean = false;

  adminColors = ADMIN_COLORS

  reloadingCollection: boolean = false;
  
  constructor(
    public db: DbService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) data,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialogService: DialogService,
    private collectionService: AdminCollectionService,
    private siteContent: SiteContentService,
    private queryService: DbQueryService,
    private dialog: MatDialog,
    private windowRef: WindowRef
  ) {
    if (!!data && !!data.searchData) this.searchData = {...data.searchData, noFilters: true};
    this.displayData = !!!this.displayData && !!data && !!data.displayData
      ? { ...this.defaultDisplayData, ...data.displayData }
      : !!this.displayData
        ? { ...this.defaultDisplayData, ...this.displayData }
        : { ...this.defaultDisplayData };
    
  }
  

  ngOnInit(): void {
    this.collectionDoc$ = !!this?.collection && !!this.collectionService?.collectionDocs[this.collection] ? this.collectionService.collectionDocs[this.collection] : null;
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    this.entityType = ENTITY_TYPE_FROM_COLLECTION[this.collection];
    this.searchData = !!this.searchData ? { 
      ...this.defaultSearchData, 
      ...this.searchData, 
      noFilters: this.hideFiltersForPaths.includes(this.searchData.path)
    } : { ...this.defaultSearchData }
    this.displayData = !!this.displayData ? { ...this.defaultDisplayData, ...this.displayData } : { ...this.defaultDisplayData }
    setTimeout$(() => {
      let visible = true;
      return visible
    }, 0)
  }

  updatingSearch(event) {
    this.searchData.search = event.search;
    if (!!event.shouldSearch) this.updateDbQuery(event.query);
  }
  
  show(search, doc) {
    return this.queryService.show(search, doc)
  }
  
  updateDbQuery(query) {
    this.docs = 'loading';
    if(!!query.startAfter) delete query.startAfter
    this.searchData = { ...this.searchData, query };

  }

  setDocs(docs:PageDoc[]) {
    this.docs = docs;
  }

  updatingDocs(updates) {
    this.docs = this.docs === 'loading' ?
      updates :
      [ ...updates,
        ...this.docs.filter(doc =>
          !updates.map(d => d.docPath).includes(doc.docPath))
      ]
  }

  deletingDocs(paths) {
    if (!!!paths || paths.length === 0) return
    this.deleted = [...this.deleted, ...paths]
  }
  
  card_Clicked({doc}) {
    return this.router.navigateByUrl(`/${ doc.microsite ? 'microsites' : 'site' }/${doc[`${doc.type}Type`]}s/${doc.docId}`);
  }

  isSelected(doc) {
    return this.selected.map(d => d.docPath).includes(doc.docPath)
  }

  selectingItems(index, event) {
    const selection = this.windowRef.nativeWindow.getSelection();
    selection.removeAllRanges();
    const startIndex = !!!event.shiftKey || index < this.lastSelectedIndex ? index : this.lastSelectedIndex + 1 ;
    const endIndex = !!!event.shiftKey || index > this.lastSelectedIndex ? index : this.lastSelectedIndex - 1 ;
    this.lastSelectedIndex = parseInt(index);
    if (event.shiftKey) {
      for (let i = startIndex; i <= endIndex; i++) {
        if (this.docs !== 'loading' && this.selected.map(d => d.docPath).includes(this.docs[i].docPath)) {
          this.selected = this.selected.filter((d: any) =>
            this.docs === 'loading' || d.docPath !== this.docs[i].docPath
          );
        } else {
          this.selected.push(this.docs[i]);
        }
      }
    } else {
      if (this.docs !== 'loading') {
        if (!this.selected.map(d => d.docPath)
            .includes(this.docs[index].docPath)) {
          this.selected.push(this.docs[index]);
        } else {
          this.selected = this.selected
            .filter((d: any) => this.docs !== 'loading' && d.docPath !== this.docs[index].docPath);
        }
      }
    }
  }

  async editCollectionDoc(elem) {
    const keys = ['title', 'description'];
    if (['projects', 'posts'].includes(this.collection)) keys.push('collectionFilters');
    let doc:CollectionDoc = await this.collectionDoc$.pipe(take(1)).toPromise()
      .catch(err => { console.error(err.message); return null });
    this.siteContent.dialogEntityForm({ elem, 
      componentParams: { doc, keys, shouldSave: false }, 
      dialogParams: { maxWidth: '600px', width: '80vw' },
      updateCallback: (update) => {
        doc = update;
      }
    }, () => {
      return this.db.updateAt(doc.docPath, { ...doc })
        .catch(console.error)
    })
  }

  reloadCollection() {
    this.reloadingCollection = true;
    setTimeout$(() => {
      this.reloadingCollection = false;
    }, 250);
  }

  newEntity(elem) {
    const _this = this;
    console.log({ elem })
    if (this.collection === 'uploads')
      return this.siteContent.dialogUploadFiles({
        elem,
        componentParams: {
          uploadTaskCompleted(task) {
            if (!Array.isArray(_this.docs)) _this.docs = [];
            _this.docs.unshift(task);
          },
          uploadsCompleted() {
            _this.dialog.closeAll()
          }
        }
      });
    return this.siteContent.dialogCreateSiteEntity(
        elem,
        this.entityType,
        `admin/${this.collection}/collection`,
    ).catch(console.error)
  }

  reorderProjects() {
    this.dialog.open(AdminReorderingCollectionComponent, {
      maxWidth: '300px',
      height: 'calc(100vh - 50px)',
      width: '90vw',
      closeOnNavigation: true,
      panelClass: 'reordering-projects-dialog',
      autoFocus: false,
    })
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '');
  }

}


/*
---------------------------------------
COMPONENT: Page
---------------------------------------
*/

@Component({
  template: `
  
    <app-shell *ngIf="searchData">
      <app-admin-collection [searchData]="searchData" [collection]="collection"></app-admin-collection>
    </app-shell>
  `
})
export class AdminCollectionPageComponent implements OnInit, OnDestroy {
  
  collection
  subscriptions: Subscription[] =[]
  defaultSearchData = DEFAULT_COLLECTION_SEARCH_DATA
  searchData

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.subscriptions.push(this.route.data.subscribe(data => {
      this.searchData = null;
      const { collection = null, searchData = {} } = data;
      this.collection = collection;
      this.searchData = { ...this.defaultSearchData, ...searchData };
    }));
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }

}