import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SiteContentService } from '../../../services/site-content.service';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { trigger, style, transition, animate, query, keyframes } from '@angular/animations';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-reordering-collection',
  templateUrl: './admin-reordering-collection.component.html',
  styleUrls: ['./admin-reordering-collection.component.scss'],
  animations: [
    trigger('isOpened', [
      transition('* <=> *', [
        query(':enter', [
          animate(".13s", keyframes([
            style({ transform: "scale(.9) translateX(120%)", opacity: 0, offset: 0 }),
            style({ transform: "scale(1) translateX(10%)", opacity: .3, offset: .9 }),
            style({ transform: "scale(1) translateX(0%)", opacity: 1, offset: 1 }),
          ]))
        ],
        { optional: true })
      ])
    ])
  ]
})
export class AdminReorderingCollectionComponent implements OnInit, OnDestroy {

  @Input() public opened: boolean = false
  @Output() public isOpened = new EventEmitter();
  docs: any[] = [];
  ogDocs: any[] = [];
  docsInView: any[] = [];
  batchSize: number = 10
  canLoadMore: boolean = true
  subscriptions: Subscription[] = []

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.docs = event.container.data.map((d, order) => { return { ...d, order } });
    this.updateDocs(this.docs).catch(console.error);
  }

  constructor(
    private siteContent: SiteContentService, 
    private db: DbService,
    public dialogRef: MatDialogRef<any>) { }

  ngOnInit() {
    this.subscriptions.push(this.siteContent.allOrderedProjects$.pipe(map(docs => {
      this.docs = docs;
      this.ogDocs = JSON.parse(JSON.stringify(this.docs));
      return docs
    })).subscribe());
  }

  async updateDocs(docs) {
    for (let i = 0; i < docs.length; i++) {
      await (async () => {
        const ogDoc = this.ogDocs?.filter(d => d.docId === docs[i].docId)[0];
        if (!!ogDoc && ogDoc.order === docs[i].order) return;
        console.log({ ogDoc })
        return await this.db.updateAt(docs[i].docPath, { order: docs[i].order })
      })();
      if (i === docs.length - 1)
        return this.ogDocs = JSON.parse(JSON.stringify(docs));
    }
  }

  trackByFn(index, item) {
    if (!!item?.docId?.length) return item;
    return index;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }

}
