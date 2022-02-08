import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SiteBlockService } from 'projects/redmond-fire-admin/src/app/services/site-block.service';
import Swiper from 'swiper';
import { Subscription } from 'rxjs';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { SiteContentService } from 'projects/redmond-fire-admin/src/app/services/site-content.service';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';


@Component({
  selector: 'app-edit-carousel',
  templateUrl: './edit-carousel.component.html',
  styleUrls: ['./edit-carousel.component.scss'],
  animations: [
     trigger('animatedList', [
          transition( '* => *', [ 
                query( ':enter', [
                  style( { opacity: 0, transform: 'scale(.7) translateY(100%)' } ),
                  stagger( 50, [
                        animate( '.6s cubic-bezier(0, 1.01, 0, 1)', style( { opacity: 1, transform: 'scale(1) translateY(0)' } ) )
                  ] )
                ], { optional: true } )
          ] )
     ])]
})
export class EditCarouselComponent implements OnInit {

  @Input() block: ContentBlock
  @Input() editingSlide: number
  @Input() doc: PageDoc
  @Input() blockIndex: number
  @Input() shouldSave: boolean = true;
  swiper: Swiper = null
  editOptions:any
  

  @Output() updated = new EventEmitter<ContentBlock>();

  drop ( event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex );
    this.block.slides = event.container.data;
    this.editingSlide = event.currentIndex
    this.updateCarousel()
  }

  confirmRemoval:number

  subscriptions: Subscription[] =[]

  constructor(private uiService : UiService, private blockService: SiteBlockService, private siteContent: SiteContentService) { }

  ngOnInit() {
    this.editOptions = {
      arrows: { 0: { icon: 'box', label: 'arrows' }, 1: { icon: 'checkbox', label: 'arrows' } },
      dots: { 0: { icon: 'box', label: 'dots' }, 1: { icon: 'checkbox', label: 'dots' } },
    }
    this.subscriptions.push(this.uiService.activeSwiper.subscribe(swiper => {
      this.swiper = swiper;
      this.editingSlide = !!swiper?.activeIndex || swiper?.activeIndex === 0 ? swiper.activeIndex : null
    }))
  }

  

  addSlide(slideIndex: number = 0) {
    this.blockService.newCarouselSlide({ doc:this.doc, slideIndex, blockIndex: this.blockIndex }, (newSlide) => {
      if (!!!newSlide) return;
      this.block.slides.splice(slideIndex, 0, newSlide);
      this.updated.emit(this.block);
      setTimeout$(() => {
        this.editingSlide = slideIndex;
        if (!!this.swiper?.slideTo) this.swiper.slideTo(slideIndex);
      }, 500)
    })
    
  }

  removeSlide(slideIndex:number = 0) {
    this.block.slides.splice(slideIndex, 1);
    this.updated.emit(this.block);
    setTimeout$(() => {
      this.editingSlide = slideIndex - 1;
      if (!!this.swiper?.slideTo) this.swiper.slideTo(slideIndex);
    }, 500)
  }

  updateCarousel() {
    if (this.shouldSave && this.doc?.docPath) {
      this.doc.blocks[this.blockIndex] = this.block;
      this.siteContent.updateDoc(this.block)
    }
    setTimeout$(() => {
      this.updated.emit(this.block)
    }, 0)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
