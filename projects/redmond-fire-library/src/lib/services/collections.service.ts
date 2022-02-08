import { Injectable } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {  CollectionDoc, CollectionFilterOption } from 'projects/redmond-fire-library/src/lib/models/collections';


@Injectable({
  providedIn: 'root'
})

export class CollectionsService {

  optionsCollections: {[key:string]: Observable<CollectionFilterOption[]>}
  
  collectionDocs: { [key: string]: Observable<CollectionDoc> }
  optionsCollectionMaps: {
      [key:string]: { [key: string]: string }
    } = { }

  constructor(private db: DbService) {
    this.collectionDocs = {
      projects: this.db.doc$('public/projects'),
      posts: this.db.doc$('public/posts')
    }
    this.optionsCollections = {
      project_sectors: this.collectionDocs.projects.pipe(map((doc: CollectionDoc) => {
        this.optionsCollectionMaps['project_sectors'] = doc.filters.sectors.reduce((acc, item) => {
          acc[item.handle] = item.label;
          return acc
        }, {});
        return doc.filters.sectors
      })),
      post_categories: this.collectionDocs.posts.pipe(map((doc: CollectionDoc) => {
        this.optionsCollectionMaps['post_categories'] = doc.filters.categories.reduce((acc, item) => {
          acc[item.handle] = item.label;
          return acc
        }, {});
        return doc.filters.categories
      }))
    };
  }

}


// export class CollectionsService {

//   private OptionsCollections = new BehaviorSubject<OptionsCollection>(null);
//   simpleCollections = this.OptionsCollections.asObservable();
//   _simpleCollections: OptionsCollection
  
//   private CollectionDocs = new BehaviorSubject<{[key:string]: CollectionDoc}>(null);
//   collectionDocs = this.CollectionDocs.asObservable();
//   _collectionDocs: {[key:string]: CollectionDoc} = {}

//   constructor(private db: DbService) {
    
//   }

//   async initOptionsCollections(force:boolean = false): Promise<OptionsCollection> {
//     if (!!this._simpleCollections && !!!force) return;
//     this._simpleCollections = {};
//     const simpleCollections = {
//       post_categories: null,
//       project_sectors: null
//     }
//     this.initOptionsCollections().catch(err => console.error(err.message));
//     return Promise.all(
//       Object.keys(simpleCollections)
//         .map(async collectionKey => {
//           this._simpleCollections[collectionKey] = await this.db.doc$(`options/${collectionKey}`).pipe(take(1)).toPromise();
//           return this._simpleCollections
//         })
//     ).then(() => {
//       this.OptionsCollections.next(this._simpleCollections);
//       return this._simpleCollections
//     }).catch(err => { throw new Error(err.message) })
//   }

//   async initCollectionDoc(collectionHandle: CollectionDocType):Promise<CollectionDoc> {

//     if (!Object.values(CollectionDocType).includes(collectionHandle)) return;
//     this._collectionDocs[collectionHandle] = await this.db.doc$(`public/${collectionHandle}`).pipe(take(1)).toPromise().catch(err => { console.error(err.message); return null });
//     this.CollectionDocs.next(this._collectionDocs)
//     return this._collectionDocs[collectionHandle]
//   }


// }
