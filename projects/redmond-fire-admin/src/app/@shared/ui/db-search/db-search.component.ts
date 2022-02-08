import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, } from '@angular/core';
import { debounceTime, map, take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { animatedList } from 'projects/redmond-fire-library/src/lib/constants/animations';
import { check_ObjectsAreTheSame, setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { SiteMediaType } from 'projects/redmond-fire-library/src/lib/models/docs';
import { DbQueryObject, DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { DbActiveFilter, DbFilterOptionType, DbQueryService } from 'projects/redmond-fire-library/src/lib/services/db-query.service';


export interface DbSearchInputData {
  path?: string;
  placeholder?: string;
  externalSearch?: boolean;
  externalDocs?: boolean;
  search?: string;
  searchField?: string;
  searchFieldOptions?: string[];
  showFilters?: boolean;
  externalFilters?: boolean;
  noFilters?: boolean;
  query?: DbQueryObject;
  group?: boolean;
  setUrlParams?: boolean;
  initParamsFromUrl?: boolean;
  selecting?: boolean;
  filterOptionTypes?: DbFilterOptionType[];
  activeFilter?: DbActiveFilter;
  mediaType?: SiteMediaType;
}

@Component({
  selector: 'app-db-search',
  templateUrl: './db-search.component.html',
  styleUrls: ['./db-search.component.scss'],
  inputs: ['data'],
  animations: animatedList
})
export class DbSearchComponent implements OnInit, OnChanges {

  @Input() data: {
    searchData: DbSearchInputData;
    selected?: any[];
    hidden?: any[];
    scrollHeight?: string;
    containerClasses?: string;
    classes?: { [key: string]: string },
    mediaOnly?: boolean
  };

  @Output() updateSelection = new EventEmitter<any>()
  @Output() theDocs = new EventEmitter<any>()
  @Output() public submitSelection = new EventEmitter<any>()

  docs: any = 'loading'
  filteredDocs:any
  fetching: boolean = false
  canLoadMore: boolean = false
  routeSubscription: Subscription
  subscriptions: Subscription[] = []
  searchData:DbSearchInputData

  logged = 0

  public searchSubject = new Subject();
  public loadMoreSubject = new Subject();
  public filteredDocsSubject = new Subject();

  constructor(private db: DbService, private route: ActivatedRoute, private router: Router, public queryService: DbQueryService) { }

  async ngOnInit() {
    this.searchData = !!this.data?.searchData ? this.data.searchData : {};
    if (typeof this.data?.containerClasses !== 'string')
      this.data.containerClasses = '';
    console.log({ searchData: this.searchData })
    const query: DbQueryObject = !!this.searchData?.query ? this.searchData.query : this.searchData.path.includes('projects') ? {orderBy: 'order,asc', limit: 10} : this.searchData.path.includes('posts') ? {orderBy: 'publishedAt,desc', limit: 10} : { orderBy: 'updatedAt,desc', limit: 10 };

    this.subscriptions.push(
      this.filteredDocsSubject.pipe(map((search: string) => {
          if (!!!search?.length) {
            this.filteredDocs = this.docs;
          } else {
            this.searchData.search = !!!search ? this.searchData.search : search;
            this.filteredDocs = [];
            if (!!!this.docs?.filter) this.docs = [];
            this.filteredDocs = !!!this.searchData.search?.length ? this.docs : this.docs.filter(d => this.show(d));
          }
        return this.theDocs.emit(this.filteredDocs);
      })).subscribe());
    this.searchData.query = query;
    if (!!!this.searchData.query) this.searchData.query = {};
    

    this.subscriptions.push(
      this.searchSubject.pipe(debounceTime(100), map((searchData: DbSearchInputData) => {
      return this.queryService.getDocs(searchData.path, searchData.query)
        .then(res => {
          const { docs = [], canLoadMore = false } = res;
          this.docs = docs;
          this.filteredDocsSubject.next(searchData.search)
          this.canLoadMore = canLoadMore;
          return this.docs;
        })
        .catch(err => console.error(err.message))
    })).subscribe());

    this.subscriptions.push(
      this.loadMoreSubject.pipe(debounceTime(100), map((nextData: { searchData, docs }) => {
      const { searchData, docs } = nextData;
      this.filteredDocs = docs.filter(d => this.show(d));
      if (!!this.canLoadMore) this.loadMore();
      return;
    })).subscribe());

    this.setSearchData(this.data.searchData);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.firstChange) return;
    const current = changes.data.currentValue;
    const prev = changes.data.previousValue;
    const noQueryChange = check_ObjectsAreTheSame(current.searchData.query, prev.searchData.query);
    this.searchData = current.searchData;
    this.filteredDocsSubject.next(current.searchData.search);
    if (current.searchData.search === prev.searchData.search && noQueryChange)
      return;
      
    if (noQueryChange) return;
    return this.searchSubject.next(current.searchData);
  }




  get scrollHeight() {
    return !!this.data?.scrollHeight ? this.data.scrollHeight : '100%'
  }

  get selected() {
    return !!this.data?.selected ? this.data.selected : []
  }

  get hidden() {
    return !!this.data?.hidden ? this.data.hidden : []
  }

  set hidden(arr) {
    this.data.hidden = arr
  }

  set selected(selected) {
    this.data.selected = selected;
    this.updateSelection.emit(selected)
  }

  setSearchData(_searchData) {
    const {
      path,
      search = '',
      searchField = 'title',
      searchFieldOptions,
      query = {},
      group = false,
      setUrlParams = false,
      initParamsFromUrl = false,
      selecting = false,
      externalSearch = false,
      externalDocs = false,
      showFilters = false,
      noFilters = false,
      externalFilters = false,
      filterOptionTypes,
      selectionType, type, mediaOnly = false
    } = _searchData;
    const newSearchData = {
      ...this.searchData,
      path,
      search,
      searchField,
      searchFieldOptions,
      query,
      group,
      setUrlParams,
      initParamsFromUrl,
      selecting,
      externalSearch,
      externalDocs,
      showFilters,
      noFilters,
      externalFilters,
      filterOptionTypes,
      selectionType,
      type, mediaOnly
    }
    if (!!this.searchData) {
      const shouldNotSearch = check_ObjectsAreTheSame(this.searchData, newSearchData);
      if (!!shouldNotSearch) return;
    }

    this.searchData = newSearchData;
    this.data.searchData = newSearchData;

    if (!!this.searchData.mediaType) {
      if (!Array.isArray(query.where)) query.where = [];
      query.where = Array.isArray(query.where) ?
        [...query.where.filter(q => q[0] !== 'mediaType'), ['mediaType', '==', this.searchData.mediaType]]
        : [['mediaType', '==', query.mediaType]];
    }
    
    this.searchSubject.next(this.searchData)
  }

  updateSearch(search: string) {
    this.searchData.search = search;
  }

  updateSearchData(event) {
    this.searchData = event;
    setTimeout$(() => {
      this.filteredDocsSubject.next(this.searchData.search);
    }, 200)
  }

  async searchDb() {
    this.docs = null;
    setTimeout$(() => {
      this.queryService.getDocs(this.searchData.path, this.searchData.query)
        .then(async (res:any) => {
          const { docs = [], canLoadMore = false } = res;
          this.docs = docs;
          this.canLoadMore = canLoadMore;
          return setTimeout$(() => {
            this.filteredDocsSubject.next(this.searchData.search);
          }, 100);
        }).catch((err) => { this.canLoadMore = false; console.error(err) });
    }, 50)
  }

  updateQueryParams() {
    const queryParams: Params = this.db.getUrlParamsFromObject({ query: this.searchData.query, asString: false });
    this.router.navigate(
      [],
      !!!queryParams ? {} : { queryParams }
    );
  }

  loadMore() {
    if (!!!this.canLoadMore) return;
    this.canLoadMore = false;
    return this.queryService.loadMore(this.searchData.query, this.docs, this.searchData.path)
      .then(res => {
        const { canLoadMore = false, docs = null } = res;
        this.docs = docs;
        setTimeout$(() => {
          this.filteredDocsSubject.next(this.searchData.search);
          this.canLoadMore = canLoadMore && !!docs?.length;
        }, 200)
      })
  }

  selectItem(doc) {
    const selected = this.selected;
    if (!selected.map((d: any) => d.docPath).includes(doc.docPath))
      selected.push(doc);
    this.selected = selected;
    this.updateSelection.emit(this.selected)
  }

  show(doc) {
    if (!Array.isArray(this.hidden)) this.hidden = [];
    if (!Array.isArray(this.selected)) this.selected = [];
    const hideDocIds = [
      ...this.hidden.map(d => !!d?.docId ? d.docId : null).filter(d => !!d),
      ...this.selected.map(d => !!d?.docId ? d.docId : null).filter(d => !!d)
    ];
    if (hideDocIds.includes(doc.docId)) return false;
    if (!!!this.searchData?.search?.length) return true;
    return this.queryService.show(this.searchData.search, doc)
  }

  submittingSelection(val) {
    this.submitSelection.emit(val)
  }

  trackByFn (item, index){
    return !!item?.docId ? item.docId :  index
  }

  ngOnDestroy() {
    // this.hidden = [];
    // this.selected = [];
    // this.updateSelection.emit([])
    // this.theDocs.emit(null);
    // this.docs = null;
    // this.subscriptions.forEach(s => s?.unsubscribe ? s.unsubscribe() : '')
    // this.searchData = null;
    !!this.routeSubscription && !!this.routeSubscription.unsubscribe ? this.routeSubscription.unsubscribe() : ''
  }
}


/*
-------------------------------------------------------------
DB search item
-------------------------------------------------------------
*/

@Component({
  selector: 'db-search-item',
  templateUrl: './db-search-item.component.html',
  styles: [],
  inputs: ['data', 'doc'],
  animations: animatedList
})
export class AdminDbSearchItemComponent implements OnInit {

  @Input() doc;
  @Input() data;
  @Input() mediaOnly:boolean = false
  @Output() selectedItem = new EventEmitter<any>()

  constructor() {
  }

  ngOnInit() { }

  selectItem() {
    this.selectedItem.emit(this.doc)
  }

}



