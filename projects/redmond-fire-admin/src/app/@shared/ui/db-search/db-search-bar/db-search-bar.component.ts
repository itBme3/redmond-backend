import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DbFilterOptionType } from 'projects/redmond-fire-library/src/lib/services/db-query.service';
import { DbQueryObject } from 'projects/redmond-fire-library/src/lib/services/db.service';



interface DbSearchBarParams {
  path: string;
  search?: string;
  searchField?: string;
  searchFieldOptions?: string[] | null;
  query?: DbQueryObject;
  group?: boolean;
  shouldSearch?: boolean;
  filterOptionTypes?: DbFilterOptionType[];
  noFilters?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-db-search-bar',
  templateUrl: './db-search-bar.component.html',
  styleUrls: ['./db-search-bar.component.scss'],
  inputs: ['data']
})
export class DbSearchBarComponent implements OnInit {

  @Input() data: DbSearchBarParams

  @Output() updateSearch = new EventEmitter<any>()
  @Output() toggleFiltersNav = new EventEmitter<boolean>()
  
  shouldSearch: boolean

  constructor () {
  }

  ngOnInit() {
    this.setData()
  }

  setData() {
    const {
      search = '',
      searchField = '',
      searchFieldOptions = null,
      query = {},
      group = false,
      showFilters = false,
      externalSearch = false,
      noFilters = false,
      filterOptionTypes,
    } = this.data;
    this.data = {
      ...this.data,
      search, searchField, searchFieldOptions,
      query, group, noFilters, showFilters, externalSearch,
      filterOptionTypes
    }
  }

  emitToggleFiltersNav(showFilters: boolean | null = null) {
    this.data.showFilters = showFilters === null ? !!!this.data.showFilters : showFilters;
    this.toggleFiltersNav.emit(this.data.showFilters)
  }

  emitSearch() {
    console.log({ ...this.data, shouldSearch: !!this.shouldSearch })
    this.updateSearch.emit({ ...this.data, shouldSearch: !!this.shouldSearch });
    this.shouldSearch = false;
  }

  newQuery(query, merge: boolean = false) {
    if (!!!merge) {
      this.data.query = query;
    } else {
      this.data.query = { ...this.data.query, ...query };
    }
  }

}
