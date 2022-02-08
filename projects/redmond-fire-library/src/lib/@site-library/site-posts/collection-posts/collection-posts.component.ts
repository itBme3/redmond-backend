import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbQueryObject, DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { capitalize } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { CollectionDoc } from 'projects/redmond-fire-library/src/lib/models/collections'
import { CollectionsService } from 'projects/redmond-fire-library/src/lib/services/collections.service';
import { Subscription, Subject, of } from 'rxjs';
import { debounceTime, switchMap, take } from 'rxjs/operators';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { SeoService } from 'projects/redmond-fire-library/src/lib/services/seo.service';

@Component({
  selector: 'app-collection-posts',
  templateUrl: './collection-posts.component.html',
  styleUrls: ['./collection-posts.component.scss']
})
export class CollectionPostsComponent implements OnInit {

  @Input() limit: number = 0
  @Input() state: 'page' | 'block' = 'page'
  @Input() docs: any[] | string[] = null
  @Input() activeFilter:string = null
  @Input() hideFilter:boolean = false

  @Input() data: {
    classes?: {
      container?: string[];
      cards?: string[];
    }
    query?: DbQueryObject | Function;
  }

  collectionDoc:CollectionDoc

  batchLimit = 10;
  subscriptions: Subscription[] = [];
  loadMoreSubject = new Subject();
  canLoadMore: boolean = false;
  filterOptions: { [key: string]: { handle: string; label: string}[]}

  constructor(private db:DbService, private seoService: SeoService, private router:Router, private route:ActivatedRoute,private uiService: UiService, private collectionService: CollectionsService) { }

  async ngOnInit() {

    this.uiService.setHasOverlayNav(false);
    
    this.subscriptions.push(this.loadMoreSubject.pipe(debounceTime(500))
      .subscribe(loadMore => this.canLoadMore = !!loadMore))

    if (this.state === 'page') {
      this.subscriptions.push(
        this.route.data.subscribe(data => {
          this.activeFilter = !!data?.collection ? data.collection : null;
        })
      )
    }

    this.collectionService.collectionDocs.posts.pipe(
      take(1),
      switchMap((collectionDoc: CollectionDoc) => {
        this.collectionDoc = !!collectionDoc ? collectionDoc : null;
        if (!!!this.collectionDoc || !!!this.collectionDoc?.filters || !!!Object.keys(this.collectionDoc.filters)?.length) return null;
        this.filterOptions = Object.keys(this.collectionDoc.filters).reduce((acc, key) => {
          acc[key] = [{ handle: null, label: 'All Posts' }, ...this.collectionDoc.filters[key]];
          return acc;
        }, {});
        if (!!this.filterOptions)
          return this.getPosts(this.activeFilter)
        return of(this.docs)
      })).subscribe()
    
  }

  get pageTitle() {
    if (!!!this.activeFilter || !!!this.collectionDoc?.title) return 'Posts';
    try {
      return !!this.collectionDoc?.state[this.activeFilter]?.title ? this.collectionDoc.state[this.activeFilter].title : capitalize(this.activeFilter);
    } catch (err) {
      return 'Posts'
    }
  }

  async changeFilter(selected) {
    const activeFilter = !!!selected ? 'posts' : selected;
    if (this.activeFilter === activeFilter && !!this.docs?.length)
      return;
    this.activeFilter = activeFilter;
    if (this.state === 'page')
      await this.router.navigateByUrl(`/${this.activeFilter}`).catch(err => { throw new Error(err.message) });
    return await this.subscriptions.push(this.getPosts(!!this.activeFilter ? this.activeFilter : 'DEFAULT').subscribe())
  }

  getPosts(hash: string, startAfter:number = 3e33, replaceDocs: boolean = true) {
    const refs = {
      DEFAULT: (ref) => ref.orderBy('publishedAt', 'desc')
        .startAfter(startAfter).limit(!!this.limit ? this.limit : this.batchLimit),
      news: (ref) => ref.where('category', '==', hash)
        .orderBy('publishedAt', 'desc')
        .startAfter(startAfter).limit(!!this.limit ? this.limit : this.batchLimit),
      thought: (ref) => ref.where('category', '==', hash)
        .orderBy('publishedAt', 'desc')
        .startAfter(startAfter).limit(!!this.limit ? this.limit : this.batchLimit),
      press: (ref) => ref.where('category', '==', hash)
        .orderBy('publishedAt', 'desc')
        .startAfter(startAfter).limit(!!this.limit ? this.limit : this.batchLimit)
    }
    return this.db.collection$('public/posts/collection',
      refs[!!!hash || ['posts', 'DEFAULT'].includes(hash) ? 'DEFAULT' : !!this.filterOptions?.categories?.map && this.filterOptions.categories.map(s => s.handle).includes(hash) ? hash : 'DEFAULT']
    ).pipe(take(1),
      switchMap((docs: any) => {
      if (!!replaceDocs) this.docs = docs;
      if (!!!replaceDocs) docs.forEach(d => this.docs.push(d))
      this.loadMoreSubject.next(docs.length === this.batchLimit);
      this.seoService.setMetaTags({ doc:null, collectionDoc: this.collectionDoc, image: !!docs[0] && !!docs[0]?.image ? docs[0].image : null})
      return of(this.docs)
    }));
  }

  loadMore() {
    if(!!!this.docs?.length) return
    this.subscriptions.push(this.getPosts(this.activeFilter, this.docs[this.docs.length - 1].publishedAt, false).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
