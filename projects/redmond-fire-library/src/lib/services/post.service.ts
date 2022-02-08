import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';

interface DefaultDoc { [key:string]: any; }

@Injectable({
  providedIn: 'root'
})
export class PostService {
            
      private CurrentPost = new BehaviorSubject<DefaultDoc>(null);
      currentPost = this.CurrentPost.asObservable();
      _currentPost = null

      private NextPrevPosts = new BehaviorSubject<{ next: DefaultDoc[]; prev: DefaultDoc[];  }>({ next: null, prev: null });
      nextPrevPosts = this.NextPrevPosts.asObservable();
      _nextPrevPosts = { next: null, prev: null }

      constructor(private db: DbService) { }

      async initPost(post) {
            this._currentPost = post;
            this.CurrentPost.next(this._currentPost);
            this._nextPrevPosts = { next: null, prev: null };
            await Promise.all(['next', 'prev'].map(async nextPrev => {
                  this._nextPrevPosts[nextPrev] = null;
                  const startAfter = this._currentPost?.createdAt;
                  this._nextPrevPosts[nextPrev] = await this.db.collection$('public/posts/collection',
                        ref => !!!startAfter ?
                              ref
                              .orderBy('createdAt', nextPrev === 'next' ? 'asc' : 'desc')
                              .limit(1)
                              : ref
                              .orderBy('createdAt', nextPrev === 'next' ? 'asc' : 'desc')
                              .startAfter(startAfter)
                              .limit(1)
                  ).pipe(take(1)).toPromise()
                        .then(docs => !!docs[0] ? docs[0] : null)
                        .catch(err => { throw new Error(err.message) })
            }))
            this.NextPrevPosts.next(this._nextPrevPosts);
      }

}