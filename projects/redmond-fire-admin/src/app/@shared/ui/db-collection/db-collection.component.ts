import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DbService, DbQueryObject } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { check_ObjectsAreTheSame } from 'projects/redmond-fire-library/src/lib/services/funcs';

@Component({
  selector: 'app-db-collection',
  templateUrl: './db-collection.component.html',
  styleUrls: ['./db-collection.component.scss']
})
export class DbCollectionComponent implements OnChanges, OnInit, OnDestroy {

  @Input() path: string;
  @Input() query: DbQueryObject = {};
  @Input() limit: number = 10;
  @Input() max: number = 0;
  @Output() theDocs = new EventEmitter<any[]>();
  @Output() appendDocs = new EventEmitter<any[]>();

  orderByField: string;

  docs:any[] = []
  canLoadMore: boolean = false;
  canLoadMoreSubject = new Subject<boolean>();
  subscriptions: Subscription[] = []

  constructor(private db: DbService) { }

  ngOnInit() {
    this.subscriptions.push(this.canLoadMoreSubject.pipe(debounceTime(500))
        .subscribe(canLoadMore => this.canLoadMore = canLoadMore))
  }

  ngOnChanges(changes: SimpleChanges): void {
    const query = !!changes?.query?.currentValue ? changes.query.currentValue : null;
    const path = !!changes?.path?.currentValue ? changes.path.currentValue : null;
    if (!!!this.query) this.query = {};
    if (path === this.path && check_ObjectsAreTheSame(query, this.query))
    this.path = path;
    this.query = !!query ? query : {};
    if (!!!this.query.orderBy) this.query.orderBy = 'createdAt,desc';
    this.orderByField = this.query.orderBy[0];
    this.getDocs().catch(console.error);
  }

  async getDocs(startAfter:any = null) {
    this.canLoadMore = false;
    const query = !!this.query ? this.query : {};
    if (!!this.limit) query.limit = this.limit;
    if (!!!this.limit && !!this.max) query.limit = this.max;
    if (!!!startAfter) {
      this.docs = null;
      this.theDocs.emit(null);
    };
    if (!!startAfter) query.startAfter = startAfter;
    return await this.db.collection$(this.path, { ...query }).pipe(take(1)).toPromise()
      .then(docs => {
        this.docs = !!startAfter ? [...this.docs, ...docs] : [...docs];
        !!startAfter ? this.appendDocs.emit(docs) : this.theDocs.emit(docs);
        this.canLoadMoreSubject.next(!!this.limit && docs.length === this.limit)
        return docs;
      }).catch(console.error);
  }

  async loadMore() {
    if (!!!this.docs?.length || !!!this.limit || ( !!this.max && !!this.docs?.length && this.docs.length >= this.max ))
      return this.canLoadMore = false;
    return await this.getDocs(this.docs.pop()[this.orderByField]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '') 
  }

}
