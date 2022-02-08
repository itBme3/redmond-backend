import { Component, Input, OnInit } from '@angular/core';
import { SelectingService } from 'projects/redmond-fire-admin/src/app/services/selecting.service';
import { SiteContentService } from 'projects/redmond-fire-admin/src/app/services/site-content.service';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { tinyDoc } from 'projects/redmond-fire-library/src/lib/services/funcs';
import {  take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-block-collection',
  templateUrl: './admin-block-collection.component.html',
  styleUrls: ['./admin-block-collection.component.scss']
})
export class AdminBlockCollectionComponent implements OnInit {

  @Input() block: ContentBlock;
  @Input() doc: PageDoc;
  @Input() blockIndex: number;
  creatingQuery: boolean = false;
  
  // collection: SiteCollectionType;
  // query: DbQueryObject;
  docs: any[] = null;

  confirmDelete:number = null

  constructor(private db: DbService, private selecting:SelectingService, private siteContent: SiteContentService) { }

  ngOnInit(): void {
    if (this.block.collectionType === 'manual' && !!!this.block?.items?.length)
      return this.selectEntities();
    if (!!this.block?.query && this.block?.collection)
      return this.getDocsFromQuery();
  }

  getDocsFromQuery() {
    this.db.collection$(`public/${this.block.collection}/collection`, this.block.query).pipe(take(1)).toPromise()
      .then(docs => this.docs = docs);
  }

  selectEntities() {
    this.selecting.selectEntity({ multiple: true }, (selection) => {
      if (!Array.isArray(this.block.items)) this.block.items = [];
      if (!!!selection?.forEach) return;
      selection.filter(itm => !this.block.items.map(doc => doc.docId).includes(itm.docId))
        .map(itm => tinyDoc(itm))
        .forEach(itm => this.block.items.push(itm))
    })
  }

  removeItem(indx) {
    this.block.items.splice(indx, 1);
    this.updateBlock()
  }

  updateBlock() {
    if (!!!this.doc.docPath || typeof this.blockIndex !== 'number') return;
    this.doc.blocks[this.blockIndex] = this.block;
    return this.siteContent.updateDoc(this.doc).catch(console.error)
  }
  
  trackByFn(indx, item) {
    return !!item.docId ? item.docId : indx
  }


}
