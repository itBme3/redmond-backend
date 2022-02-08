import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { CollectionType } from 'projects/redmond-fire-library/src/lib/models/collections';
import { take } from 'rxjs/operators';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { DbFilterOptionType } from 'projects/redmond-fire-library/src/lib/services/db-query.service';

@Component({
  selector: 'app-page-collection',
  templateUrl: './page-collection.component.html',
  styleUrls: ['./page-collection.component.scss']
})
export class PageCollectionComponent implements OnInit {

  search: string = '';
  public searchSubject = new Subject<string>();

  docs: any = null

  filterOptionTypes: { [key: string]: DbFilterOptionType[] } = {
    posts: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS, DbFilterOptionType.CATEGORY],
    pages: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS],
    team: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS],
    projects: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS, DbFilterOptionType.SECTOR],
    uploads: [DbFilterOptionType.SORT, DbFilterOptionType.STATUS],
  }

  subscriptions: Subscription[] = []
  collection: CollectionType
  showFilters = true;

  constructor(private route: ActivatedRoute, private db: DbService) { }

  ngOnInit(): void {
    this.db.doc$('options/sectors').pipe(take(1)).toPromise().catch(console.error)
    this.subscriptions.push(this.route.data.subscribe(data => this.collection = !!data.collection ? data.collection : null))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

  appendingDocs(docs) {
    if (!Array.isArray(this.docs)) this.docs = [];
    for (const doc of docs) this.docs.push(doc);
  }

}

