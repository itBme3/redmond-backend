import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { POST_TYPES, CollectionTypeSingular, CollectionType } from 'projects/redmond-fire-library/src/lib/models/collections';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs'
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-entity-handle-input',
  templateUrl: './admin-entity-handle-input.component.html',
  styleUrls: ['./admin-entity-handle-input.component.scss']
})
export class AdminEntityHandleInputComponent implements OnInit, OnDestroy {

  @Input() value: string;
  @Input() collection: CollectionType;
  @Input() doc: PageDoc;
  @Output() updated = new EventEmitter<string>()
  @Output() creating: boolean = false

  handleIsAvailable:boolean = true;
  
  updatedSubject = new Subject()

  funcs = FUNCS
  
  checkingAvailability;
  subscriptions: Subscription[] = [];
  oldLink: string = null;

  constructor(private db: DbService, private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.subscriptions.push(this.route.paramMap.subscribe(paramMap => {
      this.creating = !!!paramMap.get('docId')?.length;
    }))
    this.subscriptions.push(this.updatedSubject.pipe(
      debounceTime(500),
      map(async val => {
        const newHandle = val === '/' ? val : this.funcs.handleize(val);
        if (newHandle === this.doc.handle || !!!newHandle?.length) return;
        this.handleIsAvailable = await this.handleAvailability(newHandle).catch(err => {
          return true
        });
        if (!this.handleIsAvailable) return;
        this.value = newHandle;
        return this.updated.emit(newHandle);
      })
    ).subscribe())
    if (!!this.value?.length)
      this.handleAvailability(this.value).catch(console.error);
  }

  async handleAvailability(handle) {
    this.checkingAvailability = true;
    return await this.db.collection$(`admin/${this.collection}/collection`, (ref) => ref.where('handle', '==', handle).limit(1))
      .pipe(take(1)).toPromise()
      .then((docs: any) => {
        this.checkingAvailability = false;
        const available = !!!docs?.length;
        if (!!this.creating || !!!available) return available;
        this.oldLink = `/${POST_TYPES.includes(this.collection) ? !!this.doc?.category ? this.doc.category : CollectionType.POSTS : this.doc?.type === CollectionTypeSingular.PAGE ? CollectionType.PAGES : this.collection}${this.doc.type === CollectionTypeSingular.PAGE ? '' : '/'}${this.doc.handle}`;
        return available;
      });
  }

  addOldLinkToRedirects() {
    if (!Array.isArray(this.doc.redirects)) this.doc.redirects = [];
    this.doc.redirects.push(this.oldLink);
    return this.db.updateAt(this.doc.docPath, { redirects: this.doc.redirects })
      .then(res => this.oldLink = null)
      .catch(console.error)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }


}
