import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Params } from '@angular/router';

export const DB_QUERY_PARAM_METHODS = {
      orderBy: 'orderBy',
      startAt: 'startAt',
      startAfter: 'startAfter',
      startBefore: 'startBefore',
      limit: 'limit',
      where: 'where',
}

export type DbQueryMethod = 'orderBy' | 'startAt' | 'startAfter' | 'startBefore' | 'limit' | 'where' | string;
export const DbQueryMethods:DbQueryMethod[] = ['orderBy', 'startAt', 'startAfter', 'startBefore', 'limit', 'where']

export type DbQueryOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in' | string;

export const DbQueryOperators: DbQueryOperator[] = ['==', '!=', '>', '<', '>=', '<=', 'array-contains', 'array-contains-any', 'in', 'not-in']

export type DbQueryObjectWhereOption = [string, DbQueryOperator, any]

export interface DbQueryObject  {
  orderBy?: string;/* props separated by commas ex: { orderBy: 'createdAt,desc', where: 'this,==,that' }'*/
  where?: [[string, DbQueryOperator, any]] | [string, DbQueryOperator, any][] | any;
  limit?: number;
  startAt?: any;
  startAfter?: any;
  startBefore?: any;
  [key: string]: any
}

export interface DbQueryArrayParam {
  method: DbQueryMethod;
  field?: string;
  operator?: DbQueryOperator;
  value?: any;
  direction?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private afs: AngularFirestore) { }


  collection$(path: string, query?: DbQueryArrayParam[] | DbQueryObject | Function, noCache: boolean = false ) {
    if (typeof path !== 'string') {
      const error = { message: `path is ${path} ... needs to be a string` };
      return of([])
    }
    const the_collection$ = !!!query || query === []
      ? this.afs.collection(path)
      : this.afs.collection(path, typeof query === 'function'
        ? (_ref) => query(_ref)
        : Array.isArray(query) ? (ref) => this.parseQueryArray({ref, query})
        : (ref) => this.parseQueryObject({ref, query}));
    if (!!!the_collection$) return
    return the_collection$
      .snapshotChanges()
      .pipe(
        map((actions: any) => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  collection(path, query?: DbQueryArrayParam[] | DbQueryObject | Function): AngularFirestoreCollection {
    if (!!!query) return this.afs.collection(path);
    return this.afs.collection(path, typeof query === 'function'
        ? (_ref) => query(_ref)
        : Array.isArray(query) ? (ref) => this.parseQueryArray({ref, query})
        : (ref) => this.parseQueryObject({ref, query}));
  }

  collectionGroup$(collection_name, query?: DbQueryArrayParam[] | DbQueryObject | Function) {
    const the_collection$ = !!!query || query === []
      ? this.afs.collectionGroup(collection_name)
      : this.afs.collectionGroup(collection_name, typeof query === 'function'
        ? (_ref) => query(_ref)
        : Array.isArray(query) ? (ref) => this.parseQueryArray({ref, query})
        : (ref) => this.parseQueryObject({ref, query}));
    if (!!!the_collection$) return of(null)
    return the_collection$
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  collectionGroup(path, query?: DbQueryArrayParam[] | DbQueryObject | Function): AngularFirestoreCollectionGroup {
    if (!!!query) return this.afs.collectionGroup(path);
    return this.afs.collectionGroup(path, typeof query === 'function'
        ? (_ref) => query(_ref)
        : Array.isArray(query) ? (ref) => this.parseQueryArray({ref, query})
        : (ref) => this.parseQueryObject({ref, query}));
  }

  doc$(path): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  doc(path): DocumentReference {
    const segments = path.split('/').filter(v => v);
    const thisPath = path;
    if (segments.length % 2) {
      return this.afs.collection(path).ref.doc();
    } else {
      return this.afs.doc(path).ref;
    }
  }

  async updateAt(path: string, data: Object, merge: boolean = true): Promise<any> {

    const segments = path.split('/').filter(v => v);
    const thisPath = path;
    if (segments.length % 2) {
      if (segments[0] === 'users') {
        data['uid'] = segments[1];
      }
      data['createdAt'] = new Date().getTime();
      data['updatedAt'] = new Date().getTime();
      const docRef = this.afs.collection(path).ref.doc();
      data['docId'] = docRef.id;
      data['docPath'] = `${path}/${docRef.id}`;
      return this.afs
        .doc(docRef)
        .set(data)
        .then(() => data);
    } else {
      data['updatedAt'] = new Date().getTime();
      return this.afs
        .doc(path)
        .set(data, { merge })
        .then(() => this.doc$(thisPath).pipe(take(1)).toPromise().catch(err => {throw err})
        );
    }
  }

  async delete(path) {
    return await this.afs.doc(path).delete();
  }

  parseQueryArray({ref, query }) {
    if (!!query && query.length > 0) {
      const orderBy = query.filter(q => q.method.toLowerCase() === 'orderBy')[0];
      if (!!orderBy) {
          if (!!!orderBy.direction) {
            ref = ref.orderBy(orderBy.field);
          } else {
            ref = ref.orderBy(orderBy.field, orderBy.direction);
          }
      }
      for (const param of query) {
        if (!!param.method && param.method.toLowerCase) {
          if (param.method.toLowerCase() === "where") {
            ref = ref.where(
              param.field,
              param.operator,
              param.value
            );
          } else if (param.method.toLowerCase() === 'limit') {
            ref = ref.limit(param.value);
          } else if (param.method.toLowerCase() === 'startAt') {
            ref = ref.startAt(param.value);
          } else if (param.method.toLowerCase() === 'startAfter') {
            ref = ref.startAfter(param.value);
          }
        }
      }
    }
    return ref
  }

  parseQueryObject({ ref, query }) {
    const orderByFields = !!!query.orderBy ? null : Array.isArray(query.orderBy) ? Array.isArray(query.orderBy[0]) ? query.orderBy[0].map(arr => arr[0]) : [query.orderBy[0]] : [query.orderBy.split(',')[0]]
    const sortedMethods = Object.keys(query)
            .filter(k => DbQueryMethods.includes(k))
            .sort((a, b) => {
                  if(a === 'startAfter' || a === 'startAt' || a === 'startBefore') return 1;
                  if(b === 'startAfter' || b === 'startAt' || b === 'startBefore') return -1;
                  if(b === 'orderBy') return 1;
                  if(a === 'orderBy') return -1;
                  if(b === 'limit') return 1
                  return -1
            });
    return sortedMethods.reduce((_ref, method) => {
      if (method === 'where') {
        if (Array.isArray(query[method])) {
          return query[method].reduce((__ref, param) => {
            try {
              return __ref.where(param[0], param[1], param[2])
            } catch (err) {
              
            }
          }, _ref);
        }
        return _ref.where(query[method][0], query[method][1], query[method][2])
      }
      if (method === 'orderBy') {
        if (!Array.isArray(query.orderBy))
          return _ref.orderBy(query.orderBy.split(',')[0], query.orderBy.split(',')[1]);
        if(!Array.isArray(query.orderBy[0]))
          return _ref.orderBy(query.orderBy[0], !!query.orderBy[1] ? query.orderBy[1] : 'desc');
        query.orderBy.forEach((qry) =>
          _ref.orderBy(qry[0], !!qry[1] ? qry[1] : 'desc'));
        return _ref
      }
      if (method === 'limit')
        return _ref.limit(parseInt(query.limit));
      if (!!orderByFields) {
        for (const orderByField of orderByFields) {
          if (method === 'startAt' && query.startAt[orderByField]) {
            return _ref.startAt(query.startAt[orderByField])
          }
          if (method === 'startAfter' && query.startAfter[orderByField]) {
            return _ref.startAfter(query.startAfter[orderByField])
          }
          if (method === 'startBefore' && query.startBefore[orderByField]) {
            return _ref.startBefore(query.startBefore[orderByField])
          }
        }
      }
        
    }, ref)
  }
  
  getUrlParamsFromObject(data: { query, asString?: boolean }): Params | String {
    const { query = {}, asString = false } = data;
    const queryString = ['where', 'orderBy'].reduce((paramString, method) => {
      if (!!!query[method]) return paramString;
      let param = !!!paramString ? '?' : `${paramString}&`;
      if (method === 'orderBy') {
        let field = Array.isArray(query.orderBy) ?
          query.orderBy[0] : query.orderBy.split(',')[0];
        let direction = Array.isArray(query.orderBy) && !!query.orderBy[1] ?
          query.orderBy[1] : !!query.orderBy.split(',')[1] ?
            query.orderBy.split(',')[1] : 'desc';
        if (['createdAt', 'updatedAt'].includes(field))
          field = field.replace('At', '')
        param += `sort=${field},${direction}`;
      }
      if (method === 'where') {
        param += query.where.reduce((whereString, whereParam) => {
          const _where = Array.isArray(whereParam) ? whereParam : whereParam.split(',');
          const field = _where[0]
          const operator = _where[1]
          const val = _where[2]
          let _param = !!whereString ? `${whereString}&` : '';
          if (['mediaType', 'status'].includes(field)) {
            _param += operator === '==' ? `${field}=${val}` : `${field}${field === 'status' ? 'es' : 's'}=${val}`
          } else if (['sector', 'category'].includes(field)) {
            _param += `${field}=${val.join(',')}`
          } else {
            _param += `where=${field},${operator},${val}`
          }
          return _param
        }, null)
      }
      return param
    }, null);
    if (!!asString) return queryString;
    if (!!!queryString || !queryString.includes('=')) return {};
    return JSON.parse('{"' + decodeURI(queryString.substr(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  }

  getQueryObjectFromUrl({queryParams}) {
    class ParsedParam {
            parsed: { [key: string]: any } = {};
            key: string;
            constructor (key:string) {
              this.key = key;
                  this.parsed = this.parse();
            }
            parse() {
                    if (this.key === 'sector')
                            return { where: [[this.key, '==', queryParams[this.key]]]  };
                    if (this.key === 'category')
                            return { where: [[this.key, '==', queryParams[this.key]]]  };
                    if (this.key === 'mediaType')
                      return { where: [[this.key, '==', queryParams[this.key]]] };
                    if (this.key === 'featured')
                            return { where: [[this.key, '==', !!queryParams[this.key]]] };
                    if (this.key === 'sort') {
                            return {
                                    orderBy: [
                                            `${queryParams[this.key].split(',')[0]}${['updated','created'].includes(queryParams[this.key].split(',')[0]) ? 'At' : ''}`,
                                            !!!queryParams[this.key].split(',')[1] ? 'asc' : queryParams[this.key].split(',')[1],
                                    ],
                            };
                    }
                    if (!Array.isArray(queryParams[this.key]))
                            return {
                                    [this.key]: this.key === 'where' ?
                                        (() => { 
                                            const field = queryParams[this.key].split(',')[0]
                                            const operator = queryParams[this.key].split(',')[1]
                                            let val = queryParams[this.key].split(',')[2];
                                            if (['array-contains', 'array-contains-any', 'in', 'not-in'].includes(operator))
                                                  val = !!val?.split ? val?.split(',') : val;
                                            return [field, operator, val]
                                      })()
                                      : queryParams[this.key].includes(',') ?
                                                  queryParams[this.key].split(',')
                                                  : queryParams[this.key],
                            };
                            
                    return { [this.key]: this.key === 'where' ?
                          queryParams[this.key].map((p:any) => {
                                const field = p.split(',')[0]
                                const operator = p.split(',')[1]
                                let val = p.split(',')[2];
                                if (['array-contains', 'array-contains-any', 'in', 'not-in'].includes(operator))
                                      val = val.split(',')
                                return [field, operator, val]
                          })
                          : queryParams[this.key][0].includes(',') ?
                                      queryParams[this.key][0].split(',')
                          : queryParams[this.key][0],
                    }
            }
    }
    return Object.keys(queryParams).reduce((query:any, key) => {
            const parsedParam = new ParsedParam(key);
            const param = parsedParam.parsed;
            const paramKey = Object.keys(param)[0];
            if (!!!query[paramKey]) return { ...query, ...param };
            return { ...query, [paramKey]: [...query[paramKey], param[paramKey]] }
    }, {})
  }

}

