import { AfterViewInit, ElementRef, EventEmitter, OnDestroy, SimpleChanges, ViewChildren } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import {  Subject, Subscription } from 'rxjs';
import {  map } from 'rxjs/operators';
import {ParseClasses} from 'projects/redmond-fire-library/src/lib/services/parse-class-names'
import { ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';
import { BreakpointService } from 'projects/redmond-fire-library/src/lib/services/breakpoint.service'
import { SiteBlockService } from '../../../services/site-block.service';
import Swiper from 'swiper';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { SiteContentService } from '../../../services/site-content.service';
import { check_ObjectsAreTheSame, setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';

@Component({
  selector: 'app-admin-grid-blocks',
  templateUrl: './admin-grid-blocks.component.html',
  styleUrls: ['./admin-grid-blocks.component.scss']
})
export class AdminGridBlocksComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() doc: PageDoc;
  @Input() blocks: ContentBlock[];
  @Input() hovering: boolean = false

  @Output() updateBlocks = new EventEmitter<ContentBlock[]>();

  swiper:Swiper
  editingBlock: number = null;
  slideIndex: number = null;
  editingKey: string = null;
  blocksMenuOpened: boolean = false

  updateSubject = new Subject()
  subscriptions: Subscription[] = [];
  parseClasses = new ParseClasses()
  responsive: ScreenBreakpoint;
  updatingClassValues:boolean = false
  classValue = null

  @ViewChildren('cardBlock') cardBlocks;
  isHovered: boolean;


    
  constructor(
    private db: DbService, 
    private breakpointService: BreakpointService,
    private uiService: UiService,
    private siteContent: SiteContentService,
    public siteBlocks: SiteBlockService) { }

  ngOnInit(): void {
    if (!!this.doc?.blocks?.length && !!this.doc?.blocks[0]?.classes?.title)
      this.classValue = this.getClassValue('textSize', this.doc.blocks[0].classes.title);
    this.subscriptions.push(this.breakpointService.responsive.subscribe(responsive => this.responsive = responsive))
    this.subscriptions.push(this.updateSubject.pipe(
      map(async ({ val, key, blockIndex, reset }) =>
        await this.updateValue(val, key, blockIndex, reset))
    ).subscribe());
  }

  

  async ngAfterViewInit() {
    return await this.siteContent.getMissingImageThumbs(this.doc).catch(console.error)
  }

  setActiveSwiper(swiper) {
    this.uiService.setActiveSwiper(swiper)
  }

  consoleLog(e) {
    console.log(e)
  }

  getClassValue(optionKey, classNames) {
    // const classObj = this.parseClasses.stringToObj(classNames);
    return this.parseClasses.getValueFromClassNames(optionKey, classNames)
  }

  async updateClassValue(val, optionKey, blockKey, blockIndex) {
    const blocks = JSON.parse(JSON.stringify(this.doc.blocks))
    blocks[blockIndex].classes[blockKey] = this.parseClasses.setClassNamesFromInputValue(val, optionKey, this.doc.blocks[blockIndex].classes[blockKey], this.responsive);
    await this.db.updateAt(this.doc.docPath, { blocks }).catch(err => console.error(err.message))
    this.updatingClassValues = true;
    return setTimeout$(() => {
      return this.updatingClassValues = false;
    }, 0)
  }

  async updateValue(val, key = this.editingKey, blockIndex = this.editingBlock, debounce: boolean = false, reset: boolean = false) {

    if (!!debounce && !!val?.length) {
      this.updateSubject.next(({ val, key, blockIndex, reset: !!reset }))
      if (!!reset) {
        this.editingBlock = null;
        this.editingKey = null;
      }
    };
    if (!!!this.doc?.docPath?.length || !!!this.blocks[blockIndex] || !!!this.blocks[blockIndex][key])
      return null;
    try {
      this.blocks[blockIndex][key] = val;
      return await this.db.updateAt(this.doc.docPath, { blocks: this.blocks })
        .then(res => {
          this.updateBlocks.emit(this.blocks)
          return res
        })
        .catch(err => { throw new Error(err.message) })
    } catch (errs) {
      console.error(errs.message)
    }
  }

  resetBlocks() {
    this.cardBlocks.map(block => !!block?.theCard?.cardHeightSubject?.next ? block.theCard.cardHeightSubject.next() : '')
  }
  
  newBlock(elem, blockIndex) {
    this.siteBlocks.newBlock({ doc: this.doc, blockIndex, elem }, (res) => {
      this.resetBlocks()
    })
  }

  newCarouselSlide(elem, slideIndex:number = 0, blockIndex:number = null) {
    this.siteBlocks.newCarouselSlide({ doc: this.doc, slideIndex, blockIndex, elem }, () => {
      this.resetBlocks()
    })
  }

  saveWysiwygContent(content, blockIndex) {
    this.doc.blocks[blockIndex].content = content;
    this.siteContent.updateDoc(this.doc).catch(console.error)
  }

  trackByFn(indx, item) {
    return !!item.docId ? item.docId : indx
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
