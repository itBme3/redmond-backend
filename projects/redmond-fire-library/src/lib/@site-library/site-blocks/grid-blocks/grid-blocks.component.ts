import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { Subscription } from 'rxjs';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';


@Component({
  selector: 'app-grid-blocks',
  templateUrl: './grid-blocks.component.html',
  styleUrls: ['./grid-blocks.component.scss']
})
export class GridBlocksComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() doc: PageDoc

  @ViewChildren('appCard') appCards;

  defaultData = {
    title: null, type: null,
    link: null, linkText: null,
    image: null, aspectRatio: null, /* example >> 4:6 (must be a string of 2 numbers divided by a colon) */
    classes: { container: [], card: [], title: [] }
  }

  subscriptions: Subscription[] = []
  
  swiper: any
  editingBlock: number = null
  editingKey: string = null

  constructor(private uiService: UiService, public router: Router) { }

  ngOnInit(): void {
    Object.keys(this.defaultData).forEach(key => {
      !this.doc.hasOwnProperty(key) || this.doc[key] === undefined ? this.doc[key] = this.defaultData[key] : ''
    });

  }

  ngAfterViewInit(): void {
    setTimeout$(() => {
      this.uiService.triggerSizeReset()
    }, 1000);
  }


  trackByFn(item, index) {
    return !!item?.docId?.length ? item.docId : index
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
