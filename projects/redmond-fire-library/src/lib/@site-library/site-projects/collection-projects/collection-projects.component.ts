import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { CollectionDoc } from 'projects/redmond-fire-library/src/lib/models/collections';
import { PageDoc_Project } from 'projects/redmond-fire-library/src/lib/models/docs';
import { CollectionsService } from 'projects/redmond-fire-library/src/lib/services/collections.service';
import { Subscription, Subject, of } from 'rxjs';
import { debounceTime, switchMap, take } from 'rxjs/operators';
import { DocumentRef } from '../../../services/document-ref';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-collection-projects',
  templateUrl: './collection-projects.component.html',
  styleUrls: ['./collection-projects.component.scss']
})
export class CollectionProjectsComponent implements OnInit {

  @Input() data: {
    aspectRatio: string;
    blocks: ContentBlock[]
  }
  @Input() hideFilter: boolean = false
  @Input() state: string = null
  @Input() activeFilter: string | null = null
  @Input() placeholder: string | null = null

  homePageData = {}
  blocks = []

  docs: PageDoc_Project[];
  collectionDoc: CollectionDoc;
  subscriptions: Subscription[] = []

  viewingHandle = null;
  viewing = null;
  pageData
  filterOptions: { [key: string]: any } = { project_sectors: null };
  batchLimit: number = 10

  loadMoreSubject = new Subject();
  canLoadMore: boolean = false;

  constructor(private route: ActivatedRoute, private db: DbService, private uiService: UiService, private seoService: SeoService, private dialog: MatDialog, private router: Router, private collectionService: CollectionsService, private documentRef: DocumentRef) {

  }

  ngOnInit() {
    
    this.uiService.setHasOverlayNav(false);

    this.subscriptions.push(this.loadMoreSubject.pipe(debounceTime(500))
      .subscribe(loadMore => this.canLoadMore = !!loadMore));

    
    this.collectionService.collectionDocs.projects.pipe(
      take(1),
      switchMap(collectionDoc => {
        this.activeFilter = !!this.route?.snapshot?.fragment?.length ? this.route.snapshot.fragment : 'DEFAULT';
        this.collectionDoc = !!collectionDoc ? collectionDoc : null;
        if (!!!this.collectionDoc || !!!this.collectionDoc?.filters || !!!Object.keys(this.collectionDoc.filters)?.length) return null;
        this.filterOptions = Object.keys(this.collectionDoc.filters).reduce((acc, key) => {
          acc[key] = [{ handle: null, label: 'All Projects' }, { handle: 'featured', label: 'Featured' }, ...this.collectionDoc.filters[key]];
          return acc;
        }, {});
        if (!!this.filterOptions)
          return this.getProjects(this.activeFilter);
        return of(this.docs)
      })).subscribe();
    
  }

  get collectionHandle() {
    const sector = this.activeSector();
    if(!!sector) return this.collectionDoc.state.sector.handle.replace('{sector}', sector.handle)
  }

  get pageTitle() {
    try {
      if (!!!this.activeFilter || !!!this.collectionDoc) return 'Projects';
      const sector = this.activeSector();
      const key = this.activeFilter === 'featured' ? 'featured' : !!sector ? 'sector' : null;
      if (!!!key || !!!this.collectionDoc?.state || !!!this.collectionDoc?.state[key] || !this.collectionDoc.state[key].hasOwnProperty('title'))
        return this.collectionDoc.title;
      return this.collectionDoc.state[key].title.replace('{sector}', sector.label)
    } catch (err) {
      return 'Projects'
    }
  }

  activeSector() {
    return !!this.filterOptions?.project_sectors?.filter && !!this.filterOptions.project_sectors.filter(s => s.handle === this.activeFilter)[0] ?
        this.filterOptions.project_sectors.filter(s => 
          s.handle === this.activeFilter
        )[0] :
        null;
  }

  async changeFilter(selected) {
    if (this.activeFilter === selected && !!this.docs?.length)
      return;
    this.activeFilter = selected
    if (this.state === 'page')
      await this.router.navigate([], {
        relativeTo: this.route,
        fragment: !!this.activeFilter ? this.activeFilter : null,
        queryParamsHandling: 'merge'
      }).catch(err => { throw new Error(err.message) });
    return await this.subscriptions.push(this.getProjects(!!this.activeFilter ? this.activeFilter : null).subscribe())
  }

  getProjects(hash: string, startAfter:any = null, replaceDocs: boolean = true, shouldSubscribe: boolean = true) {
    const refs = {
      DEFAULT: (ref) => ref.orderBy('order', 'asc')
        .startAfter(startAfter).limit(this.batchLimit),
      featured: (ref) => ref.where('featured', '==', true)
        .orderBy('order', 'asc')
        .startAfter(startAfter).limit(this.batchLimit),
      sector: (ref) => ref.where('sector', '==', hash)
        .orderBy('order', 'asc')
        .startAfter(startAfter).limit(this.batchLimit)
    }
    console.log({hash, startAfter, replaceDocs})
    return this.db.collection$('public/projects/collection',
      refs[!!!hash ? 'DEFAULT' : hash === 'featured' ? hash : !!this.filterOptions?.sectors?.map ? this.filterOptions.sectors.map(s => s.handle).includes(hash) ? 'sector' : 'DEFAULT' : 'DEFAULT']
    ).pipe(switchMap((docs: any) => {
      if (!!replaceDocs) this.docs = docs;
      if (!!!replaceDocs) docs.forEach(d => this.docs.push(d))
      this.loadMoreSubject.next(docs.length === this.batchLimit);
      this.seoService.setMetaTags({ doc: null, collectionDoc:this.collectionDoc, image: !!docs[0] && !!docs[0]?.image ? docs[0].image : null })
      return of(this.docs);
    }));
  }

  loadMore() {
    const lastDoc = this.docs[this.docs.length - 1];
    if (!!!lastDoc?.createdAt) return this.canLoadMore = false;
    return this.subscriptions.push(this.getProjects(this.activeFilter, this.docs[this.docs.length - 1].order, false).subscribe())
  }



  ngOnDestroy(): void {
    if (!!this.dialog?.closeAll) this.dialog.closeAll();
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}

