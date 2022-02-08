import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { EntityStatus } from '../models/docs';
import { DbQueryObject, DbQueryOperator, DbService } from './db.service';


export enum DbFilterOptionType {
  SORT = 'sort',
  STATUS = 'status',
  CATEGORY = 'category',
  SECTOR = 'sector',
}

export const dbFilterOptionTypes: DbFilterOptionType[] = Object.values(DbFilterOptionType)

export interface DbActiveFilter {
  sort?: DbSortOption;
  status?: EntityStatus;
  sector?: string;
  category?: string;
}

export type DbSortOption = 'updated (newest)' | 'created (oldest)' | 'title (A-Z)' | 'title (Z-A)' | string
export const dbSortLabelToFilterObject = {
      'ordered': [ 'order', 'asc' ],
      'title (A-Z)': ['title', 'asc'],
      'title (Z-A)': ['title', 'desc'],
      'created (newest)': ['createdAt', 'desc'],
      'updated (newest)': ['updatedAt', 'desc'],
      'published (newest)': ['publishedAt', 'desc'],
      'created (oldest)': ['createdAt', 'asc'],
      'updated (oldest)': ['updatedAt', 'asc'],
      'published (oldest)': ['publishedAt', 'asc'],
}

export const dbSortObjectToLabel = (obj: [string, string]) => {
      const field = obj[0]
      const direction = obj[1]
      return !!!field ? null
            : `${field.replace('At', '')}${field !== 'order' ? ` (${field === 'order' ? 'asc'
            : direction === 'asc' ? field === 'title' ? 'A-Z' : 'oldest'
                  :  field === 'title' ? 'Z-A' : 'newest' })` : ''}`;
}


@Injectable({
  providedIn: 'root'
})
export class DbQueryService {

  // private Docs = new BehaviorSubject<any[]>(null);
  // docs = this.Docs.asObservable();
  // _docs: any[] = null;

  // private ActiveFilter = new BehaviorSubject<DbActiveFilter>(null);
  // activeFilter = this.ActiveFilter.asObservable();
  // _activeFilter: DbActiveFilter = null;

  // private DbQuery = new BehaviorSubject<DbQueryObject>(null);
  // dbQuery = this.DbQuery.asObservable();
  // _dbQuery: DbQueryObject | any = null;
  
  // private CanLoadMore = new BehaviorSubject<boolean>(false);
  // canLoadMore = this.CanLoadMore.asObservable();
  // _canLoadMore = false

  defaultParams: DbQueryObject = { limit: 6, orderBy: 'updatedAt,desc' }
  searchString: string;
  filteredDocs: any[];
  collectionPath: string;
  projectSectors: any;

  constructor(private db: DbService) { }



  async initCalls(collectionPath: string, dbQuery, activeFilter = null) {
    const _dbQuery = !!dbQuery ? dbQuery : this.defaultParams;
    const docs = await this.db.collection$(collectionPath, dbQuery).pipe(take(1)).toPromise()
      .catch(err => { console.error(err.message); return null });
    const canLoadMore = docs.length >= _dbQuery.limit && _dbQuery.limit > 0;
    const _activeFilter = !!activeFilter ? activeFilter : this.filterFromQuery(_dbQuery);
    return {
      docs: docs,
      query: _dbQuery,
      canLoadMore,
      activeFilter: _activeFilter,
    }
  }




  async getDocs(path: string, dbQuery: DbQueryObject = null): Promise<{docs: any; canLoadMore: boolean}> {
    const _dbQuery = !!dbQuery ? dbQuery : this.defaultParams;
    if (!!!_dbQuery?.limit)
      _dbQuery.limit = 6;
    if (!!!_dbQuery?.orderBy)
      _dbQuery.orderBy = path.includes('projects') ? 'order,asc' : path.includes('posts') ? 'publishedAt,desc' : 'updatedAt,desc';
    if (!!_dbQuery?.where?.length) {
      _dbQuery.where = _dbQuery.where.filter(q => !['array-contains-any', 'in'].includes(q[1]) || q[2].length > 0);
      if (!!!_dbQuery?.where?.length)
        delete _dbQuery.where;
    }
    let docs = null;
    try {
      const collection = await this.db.collection(path, _dbQuery).get({ source: 'server' });
      docs = await collection.pipe(take(1)).toPromise().then(a => a.docs.map(d => d.data()));
    } catch (err) {
      throw new Error(err.message);
    } finally {
      return { docs, canLoadMore: !!_dbQuery.limit && docs.length >= _dbQuery.limit }
    }
  }

  show(search: string = this.searchString, doc: any) {
    this.searchString = !!!search?.toLowerCase ? '' : search.toLowerCase();
    if (!!!this.searchString?.length) return true;
    return this.searchString.split(' ').reduce((matches, word) => {
      if (!!!matches) return false;
      return JSON.stringify(!!doc ? doc : {})?.toLowerCase().includes(word.toLowerCase())
    }, true)
  }

  async loadMore(dbQuery, currentDocs, collectionPath: string, group: boolean = false): Promise<{ canLoadMore: boolean; docs: any[] }> {
    if (!!!dbQuery?.orderBy || !!!currentDocs?.length || !!!currentDocs[currentDocs.length - 1])
      return { docs: currentDocs, canLoadMore: false };
    delete dbQuery.startAfter;
    delete dbQuery.startBefore;
    return await this.db[!!group ? 'collectionGroup$' : 'collection$'](collectionPath, {
      limit: dbQuery.limit, ...dbQuery,
      startAfter: currentDocs[currentDocs.length - 1]
    }).pipe(take(1)).toPromise()
      .then(_docs => {
        if (!!!Array.isArray(currentDocs))
          currentDocs = [];
        const docs = [...currentDocs, ..._docs];
        const canLoadMore = _docs.length >= dbQuery.limit && dbQuery.limit > 0
        return { docs, canLoadMore }
      }).catch(err => { console.error(err.message); return null});
  }
  
  filterFromQuery(query: DbQueryObject): DbActiveFilter {
    if (!!!query) return null;
    const res = Object.keys(query)
      .reduce((_activeFilter: DbActiveFilter, key: string) => {
        if (key === 'orderBy') {
          const orderByField = Array.isArray(query.orderBy) ?
            query.orderBy[0] : query.orderBy.split(',')[0];
          const orderByDirection = Array.isArray(query.orderBy) && query.orderBy[1] ?
            query.orderBy[1] :
            query.orderBy.split(',')[1];
          if(orderByField === 'order') return { ..._activeFilter, sort: 'ordered' }
          if (orderByField === 'title')
            return { ..._activeFilter, sort: `title ${orderByDirection === 'desc' ? '(A-Z)' : '(Z-A)'}` }
          if (['updatedAt', 'createdAt', 'publishedAt'].includes(orderByField))
            return { ..._activeFilter, sort: `${orderByField.replace('At', '')} ${orderByDirection === 'desc' ? '(newest)' : '(oldest)'}` }
        }
        if (key === 'where') {
          return {
            ...query.where.reduce((whereFilters, param: [string, DbQueryOperator, any]) => {
              return { ...whereFilters, [param[0].includes('Type') ? param[0] + 's' : param[0]]: param[2] }
            }, !!_activeFilter ? _activeFilter : {})
          }
        }
        return { ..._activeFilter }
      }, {});
    console.log({res})
    return res
}

  queryFromFilter(activeFilter: DbActiveFilter, merge: DbActiveFilter = null): DbQueryObject {
    const _activeFilter = !!merge ? { ...merge, ...activeFilter } : activeFilter;
    if (!!!activeFilter.sort) activeFilter.sort = 'updated (newest)';
    return Object.keys(activeFilter).reduce((query: DbQueryObject, key: DbFilterOptionType) => {
      if (key === 'sort') {
        if (activeFilter[key] === 'ordered')
          return { ...query, orderBy: 'order,asc' };
        if (activeFilter[key] === 'created (oldest)')
          return { ...query, orderBy: 'createdAt,asc' };
        if (activeFilter[key] === 'created (newest)')
          return { ...query, orderBy: 'createdAt,desc' };
        if (activeFilter[key] === 'published (oldest)')
          return { ...query, orderBy: 'publishedAt,asc' };
        if (activeFilter[key] === 'published (newest)')
          return { ...query, orderBy: 'publishedAt,desc' };
        if (activeFilter[key] === 'updatedAt (oldest)')
          return { ...query, orderBy: 'updatedAtAt,asc' };
        if (activeFilter[key] === 'updatedAt (newest)')
          return { ...query, orderBy: 'updatedAtAt,desc' };
        if (activeFilter[key] === 'title (A-Z)')
          return { ...query, orderBy: 'title,asc' };
        if (activeFilter[key] === 'title (Z-A)')
          return { ...query, orderBy: 'title,desc' };
        return { ...query, orderBy: 'updatedAt,desc' };
      }
      const whereQueries: string[] = dbFilterOptionTypes.filter(s => s !== 'sort');
      if (whereQueries.includes(key)) {
        const _key: string = ['postTypes'].includes(key) ? `${key.substr(0, key.length - 1)}` : key;
        const _operator: string = '==';
        const _value: any = !!activeFilter && !!activeFilter[key] && activeFilter[key]
          ? activeFilter[key] : null;
        if (!!_value && _value.length > 0) {
          return {
            ...query,
            where: !!!query.where || query.where.length === 0
              ? [[_key, _operator, _value]]
              : !Array.isArray(query.where[0]) ? [[...query.where], [_key, _operator, _value]] : [...query.where, [_key, _operator, _value]]
          }
        }
      }
      return { ...query }
    }, { ...this.defaultParams });
  }
  

}












