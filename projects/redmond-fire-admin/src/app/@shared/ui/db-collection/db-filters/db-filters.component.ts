import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { DbActiveFilter, DbFilterOptionType, dbFilterOptionTypes, DbQueryService, DbSortOption } from 'projects/redmond-fire-library/src/lib/services/db-query.service';
import { DbQueryObject } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { EntityStatus } from 'projects/redmond-fire-library/src/lib/models/docs';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-db-filters',
  templateUrl: './db-filters.component.html',
  styleUrls: ['./db-filters.component.scss']
})
export class DbFiltersComponent implements OnChanges, OnDestroy {

  @Input() data: {
    query: DbQueryObject | any;
    filterOptionTypes: DbFilterOptionType[];
    filterOptions?: { [key:string]: any };
    activeFilter?: DbActiveFilter;
    collection?: string;
  } = {
      query: {},
      filterOptionTypes: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS], activeFilter: {}
  }
  @Output() updateQuery = new EventEmitter<any>()
  search: string = ''
  
  defaultParams:DbQueryObject = { limit: 10, orderBy: 'updatedAt,desc' }
  status: EntityStatus = null
  activeFilterKeys: string[]
  activeFilter: DbActiveFilter;
  // microsites$

  singleSelectKeys:string[] = ['sort', 'status', 'sector', 'category']
  singleSelectOptions: { status: EntityStatus[], sort: DbSortOption[], sector?:string, category?: string } = {
    status: [EntityStatus.PUBLISHED, EntityStatus.DRAFT, EntityStatus.HIDDEN],
    sort: ['created (newest)', 'created (oldest)', 'title (A-Z)', 'title (Z-A)', 'updated (newest)'],
  }

  currentPage: any

  subscriptions: Subscription[] = []

  constructor(private queryService: DbQueryService) {
  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<any> {
    if (!!!this.data.query) this.data.query = {};
    console.log({ query: this.data.collection })
    if (changes.data.firstChange) {
      if (this.data.collection === 'projects') {
        this.defaultParams.orderBy = 'order,asc';
        this.singleSelectOptions.sort.unshift('ordered')
      }
      if (this.data.collection === 'posts') {
        this.defaultParams.orderBy = 'publishedAt,desc';
        this.singleSelectOptions.sort = this.singleSelectOptions.sort.map(option => option.replace('created', 'published'))
      }
    }
    this.data.query = { ...this.defaultParams, ...this.data.query };
    if (!!changes.data.firstChange) {
      // this.queryService.initCalls(this.data.collectionPath, this.data.query, this.search, this.activeFilter)
      this.singleSelectKeys = this.data.filterOptionTypes;
    }
    if(!!this.data.query)
      this.data.activeFilter =  this.queryService.filterFromQuery(this.data.query);
  }

  queryFromFilter(merge: DbActiveFilter = this.data.activeFilter) {
    this.data.query = this.queryService.queryFromFilter(this.activeFilter, merge)
    return this.updateQuery.emit(this.data.query)
  }

  filterFromQuery(query) {
    if (!!!query) return;
    this.data.activeFilter = this.queryService.filterFromQuery(query)
    this.updateQuery.emit(this.data.query);
  }

  updateQueryParam(filterOptionType, value) {
    if (!!!this.data.activeFilter) this.data.activeFilter = {};
    if (dbFilterOptionTypes.includes(filterOptionType))
      this.data.activeFilter[filterOptionType] = value;
    this.data.query = this.queryService.queryFromFilter({ [filterOptionType]: value }, !!this.data?.activeFilter ? this.data.activeFilter : null);
    this.updateQuery.emit(this.data.query);
  }

  clearParam(optionType) {
    delete this.data.activeFilter[optionType];
    this.data.query = this.queryService.queryFromFilter(this.data.activeFilter, null);
    this.updateQuery.emit(this.data.query);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }

}
