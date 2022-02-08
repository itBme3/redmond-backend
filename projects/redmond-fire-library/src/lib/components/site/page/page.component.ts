import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PageDoc, SiteCollectionType } from 'projects/redmond-fire-library/src/lib/models/docs';
import { CollectionType, POST_TYPES } from 'projects/redmond-fire-library/src/lib/models/collections';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { DbService } from '../../../services/db.service';
import { SeoService } from 'projects/redmond-fire-library/src/lib/services/seo.service';
import { map, switchMap, take } from 'rxjs/operators';



@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PreviewPageComponent implements OnInit, OnDestroy {

  isHomePage: boolean = false;
  postTypes = POST_TYPES
  page:string = null;

  subscriptions: Subscription[] = []
  collection: SiteCollectionType
  collectionType: SiteCollectionType
  pageData
  doc:any = null
  collectionDoc: any = null
  dbQuery
  
  constructor(private route: ActivatedRoute, private uiService: UiService, private db: DbService, private seoService: SeoService) {
    
  }

  ngOnInit(): void {
    this.subscriptions.push(this.route.data.pipe(map(data => {
      this.doc = null;
      const { page = null, isHomePage = false, collection = null, doc$, collectionDoc$ = null, dbQuery = {}} = data;
      this.page = page;
      this.isHomePage = isHomePage;
      this.collection = this.postTypes.includes(collection) ? CollectionType.POSTS : collection;
      this.dbQuery = dbQuery;
      if (!!doc$) {
        this.seoService.setMetaTags({ doc: doc$, collectionDoc: null })
        this.doc = doc$
        return this.uiService.setHasOverlayNav(this.isHomePage || (this.doc?.blocks?.length && this.doc.blocks[0]?.blockType === 'carousel'));
      }
      if (!!collectionDoc$) {
        this.seoService.setMetaTags({ collectionDoc: collectionDoc$, doc: null, image: null })
        this.collectionDoc = collectionDoc$;
        return this.uiService.setHasOverlayNav(false);
      }
      this.uiService.setHasOverlayNav(false);
    })).subscribe());
  }
  


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '');
    
  }

}
