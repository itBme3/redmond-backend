import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDoc, PAGE_KEYS_BY_TYPE, SiteEntityType } from 'projects/redmond-fire-library/src/lib/models/docs';
import { check_ObjectsAreTheSame } from 'projects/redmond-fire-library/src/lib/services/funcs'
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service'
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ADMIN_COLORS } from 'projects/redmond-fire-library/src/lib/constants/admin-pages';
import { SiteBlockService } from '../../services/site-block.service';
import { SiteContentService } from '../../services/site-content.service';

export const SITE_PAGE_KEYS: { [key: string]: string[] } = {
    [SiteEntityType.PAGE]: [...PAGE_KEYS_BY_TYPE[SiteEntityType.PAGE]],
    [SiteEntityType.PROJECT]: [...PAGE_KEYS_BY_TYPE[SiteEntityType.PROJECT]],
    [SiteEntityType.POST]: [...PAGE_KEYS_BY_TYPE[SiteEntityType.POST]],
    [SiteEntityType.TEAM]: [...PAGE_KEYS_BY_TYPE[SiteEntityType.TEAM]],
  }

@Component({
  selector: 'app-admin-site-page-single',
  templateUrl: './admin-site-page-single.component.html',
  styleUrls: ['./admin-site-page-single.component.scss']
})
export class AdminSitePageSingleComponent implements OnInit, OnDestroy {

  doc: PageDoc
  collection: string
  subscriptions: Subscription[] = []
  docSubscription: Subscription
  docId: string
  editingDoc:PageDoc = null
  editing: 'Page Info' | 'Blocks' | 'Redirects'
  sidenavOpened = true
  swiper
  hovering: boolean = false

  @ViewChildren('cardBlock') cardBlocks;
  
  pageKeys = {
    [SiteEntityType.POST]: SITE_PAGE_KEYS[SiteEntityType.POST],
    [SiteEntityType.PROJECT]: SITE_PAGE_KEYS[SiteEntityType.PROJECT],
    [SiteEntityType.PAGE]: ['title',...PAGE_KEYS_BY_TYPE[SiteEntityType.PAGE]],
    [SiteEntityType.TEAM]: ['bio', 'linkedIn', 'funFact'  ],
  }
  pageColors = ADMIN_COLORS
  
  public updateDocSubject = new Subject()

  constructor(private route: ActivatedRoute,
            private db: DbService,
            private siteContent: SiteContentService,
            private siteBlocks: SiteBlockService,
            private location: Location ) {
    
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.updateDocSubject.pipe(debounceTime(100), map((docs: {current, new}) => {
        const currentDoc = Object.keys(docs.new).reduce((acc, key) => {
          return { ...acc, [key]: docs.current[key]}
        }, {});
        if (!check_ObjectsAreTheSame(docs.new, currentDoc))
          this.db.updateAt(docs.current.docPath, docs.new)
        return docs.new;

      })).subscribe()
    );
    this.route.data.subscribe(data => {
      if (this.collection === data.collection && !!this.docId)
        return;
      this.collection = data.collection;
      if (!!!this.docId) return;
      this.setDoc();
    })

    this.route.params.subscribe(params => {
      const docId = params.docId;
      if (this.docId === docId && !!this.collection) return;
      this.docId = docId;
      if (!!!this.collection) return;
      this.setDoc()
    })

    
  }

  newCarouselSlide(elem, slideIndex: number = 0, blockIndex: number = null) {
    this.siteBlocks.newCarouselSlide({ doc: this.doc, blockIndex, slideIndex, elem }, () => {
      this.resetBlocks()
    })
  }


  resetBlocks() {
    this.cardBlocks.map(block => !!block?.theCard?.cardHeightSubject?.next ? block.theCard.cardHeightSubject.next() : '')
  }

  editDialog(elem, doc, keys, dialogParams = null) {
    this.editingDoc = doc;
    const _this = this;
    this.siteContent.dialogEntityForm({
      elem, componentParams: { keys, doc }, dialogParams,
      updateCallback: (doc) => {
        _this.editingDoc = doc;
      }
    })
  }
  
  setDoc() {
    if (this.docSubscription?.unsubscribe)
      this.docSubscription.unsubscribe();
    
      this.docSubscription = this.db.doc$(`admin/${this.collection}/collection/${this.docId}`)
        .subscribe(doc => this.doc = doc);
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
