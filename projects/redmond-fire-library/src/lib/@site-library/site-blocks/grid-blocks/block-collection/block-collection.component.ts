import { Component, Input, OnInit } from '@angular/core';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-block-collection',
  templateUrl: './block-collection.component.html',
  styleUrls: ['./block-collection.component.scss']
})
export class BlockCollectionComponent implements OnInit {

  @Input() block: ContentBlock;
  @Input() docs: any[] = null;
  creatingQuery: boolean = false;
  
  // collection: SiteCollectionType;
  // query: DbQueryObject;

  confirmDelete: number = null
  removing:number = null

  constructor(private db: DbService) { }

  ngOnInit(): void {
    if (!!this.docs) return;
    if (!!this.block?.query) return this.getDocsFromQuery();
    this.docs = Array.isArray(this.block?.items) ? this.block.items : null;
  }

  getDocsFromQuery() {
    this.db.collection$(`public/${this.block.collection}/collection`, this.block.query).pipe(take(1)).toPromise()
      .then(docs => this.docs = docs);
  }
  
  trackByFn(indx, item) {
    return !!item.docId ? item.docId : indx
  }


}
