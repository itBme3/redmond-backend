import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionDoc, CollectionFilterOption } from '../models/collections';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCollectionService {

  optionsCollections: {[key:string]: Observable<CollectionFilterOption[]>}
  
  collectionDocs: { [key:string]: Observable<CollectionDoc> }

  constructor(private db: DbService) {
    this.collectionDocs = {
      projects: this.db.doc$('admin/projects'),
      posts: this.db.doc$('admin/posts')
    }
    this.optionsCollections = {
      project_sectors: this.collectionDocs.projects.pipe(map((doc:CollectionDoc) => doc.filters.sectors)),
      post_categories: this.collectionDocs.posts.pipe(map((doc:CollectionDoc) => doc.filters.categories))
    };
  }



}

