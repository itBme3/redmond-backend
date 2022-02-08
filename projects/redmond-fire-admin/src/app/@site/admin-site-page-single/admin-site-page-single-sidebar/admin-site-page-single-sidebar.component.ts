import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs'
import { debounceTime, map } from 'rxjs/operators';
import { SingleEntitySidenavSectionType, SiteContentService } from '../../../services/site-content.service';
import { SITE_PAGE_KEYS } from '../admin-site-page-single.component';
import { WindowRef } from 'projects/redmond-fire-library/src/lib/services/window-ref';
import { DocumentRef } from 'projects/redmond-fire-library/src/lib/services/document-ref';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { PageDoc, PAGE_KEYS_BY_TYPE, SiteEntityType } from 'projects/redmond-fire-library/src/lib/models/docs'
import { ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';

@Component({
  selector: 'app-admin-site-page-single-sidebar',
  templateUrl: './admin-site-page-single-sidebar.component.html',
  styleUrls: ['./admin-site-page-single-sidebar.component.scss']
})
export class AdminSitePageSingleSidebarComponent implements OnInit {

  @Input() doc: PageDoc;
  
  sidebarKeys = {
    [SiteEntityType.POST]: ['handle','category','description',  'featured', 'content', /* 'author'*/],
    [SiteEntityType.PROJECT]: ['handle','sector', 'description', 'featured', 'client', 'city',  'state'],
    [SiteEntityType.PAGE]: ['title', 'handle', 'description', 'pageHeading'],
    [SiteEntityType.TEAM]: ['jobTitle', 'linkedIn', 'bio'],
  }

  editing:SingleEntitySidenavSectionType = SingleEntitySidenavSectionType.PAGE_INFO;

  pageData: any;
  adminMicrositeSubscription: Subscription;
  responsive: ScreenBreakpoint = ScreenBreakpoint.DEFAULT;
  subscriptions: any[] = []
  funcs = FUNCS

  pageKeys = SITE_PAGE_KEYS
  
  constructor(
    private db: DbService,
    private siteContent: SiteContentService,
    private windowRef: WindowRef,
    private documentRef: DocumentRef
  ) {
  }


  ngOnInit(): void {
    if (!!this?.doc?.type && PAGE_KEYS_BY_TYPE[this.doc.type])
      this.pageKeys = PAGE_KEYS_BY_TYPE[this.doc.type]
        .filter(k => !['carousel', 'blocks'].includes(k));
    let firstResponse = true;
    this.subscriptions.push(
      this.siteContent.editingEntityContent.pipe(
        debounceTime(500), map((editingEntity) => {
          if (!firstResponse || !!editingEntity?.editing) this.editing = editingEntity.editing;
          firstResponse = false;
          const elem = (sidebar: boolean = false) => {
            return typeof editingEntity.blockIndex === 'number' ?
              !sidebar && !!editingEntity.contentDocPath ?
                !!this.documentRef.nativeDocument?.querySelector ?
                  this.documentRef.nativeDocument.querySelector(`.single-entity${sidebar ? '-sidebar' : ''}-container [data-content-doc-path="${editingEntity.contentDocPath}"]`)
                  : this.documentRef.nativeDocument.querySelector(`.single-entity${sidebar ? '-sidebar' : ''}-container [data-block-index="${editingEntity.blockIndex}"]`)
                : null : null;
          }
          this.funcs.scrollTo({ elem: elem(true), scrollContainer: '.single-entity-sidebar-container', offset: this.windowRef?.nativeWindow?.innerHeight / 3 });
          FUNCS.setTimeout$(() => { this.funcs.scrollTo({ elem: elem(), scrollContainer: '.single-entity-container' }) }, 250 );
          
          return editingEntity;
        })))
    this.subscriptions.forEach(s => !!s.subscribe ? s.subscribe() : '')
  }


  get isResponsive() {
    return ['mobile', 'desktop'].includes(this.responsive)
  }

  updateDoc(attr, val) {
      return this.db.updateAt(this.doc.docPath, { [attr]: val }).catch(console.error)
  }

  changeEditing(editing) {
    this.editing = editing;
    this.siteContent.changeEditingEntityContent({ editing })
  }

  updateCallback(e) {
    console.log(e)
  }
  trackByFn(indx, item) {
    return !!item.docId ? item.docId : indx
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe : '')
  }
  
}

