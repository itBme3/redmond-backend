import { AfterContentInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';

import SwiperCore, { SwiperOptions } from 'swiper';
import { Observable, Subject, Subscription } from 'rxjs';
import { numFromRatio, scrollTo, setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { DEFAULT_SWIPER_OPTIONS } from '../../../constants/swiper-settings';
import { DocumentRef } from '../../../services/document-ref';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([]);


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  inputs: ['data']
})
export class CarouselComponent implements OnInit, AfterContentInit {

  @Output() public swiperObj = new EventEmitter<any>()
  state: 'loading' | 'ready' = 'loading'
  @Input() data: {
    aspectRatio?: string | null;
    scrollOnOnChange?: boolean;
    thumbs?: boolean;
    dots?: boolean,
    arrows?: boolean,
  }
  @Input() swiperOptions: SwiperOptions = {};
  
  config
  thumbSwiper

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('swiperThumbs') swiperThumbs;
  @ViewChildren('swiperSlide') swiperSlides;

  @HostListener('window:resize')
  onResize() {
    this.setSelfHeight();
    console.log({ swiper: this.swiper })
  }
  
  slideHeight: string;

  scrollSubject = new Subject()
  scrolling$ : Observable<any>

  subscriptions:Subscription[] = []

  constructor(public elemRef: ElementRef, private documentRef: DocumentRef) { }

  ngOnInit() {
    // this.subscriptions.push(this.scrollSubject.pipe(debounceTime(1500))
    //   .subscribe(this.centerCarouselInView))
  }
  

  ngAfterContentInit() {
      this.setSelfHeight();
      this.initSwiper();
  }

  initSwiper(tried: number = 0) {
    if (!!!this.config) {
      const autoplay = typeof this.swiperOptions?.autoplay === 'number' ? { delay: this.swiperOptions.autoplay, pauseOnMouseEnter: true, disableOnInteraction: false } : !!Object.keys(!!!this.swiperOptions?.autoplay ? {} : this.swiperOptions.autoplay).length ? this.swiperOptions.autoplay : false;
      const height = numFromRatio(this.elemRef.nativeElement.offsetWidth, !!this.data?.aspectRatio ? this.data?.aspectRatio : '16:9');
      this.config = {
        ...DEFAULT_SWIPER_OPTIONS,
        ...this.swiperOptions,
        autoplay, height,
        loop: true,
        autoHeight: !!!height
      };
    }
    
    return setTimeout$(() => {
      this.swiperSlides = this.elemRef.nativeElement.querySelectorAll('[slide]');
      console.log({swiperSlides: this.swiperSlides})
      if (!!!this.swiperSlides?.length && tried < 20) return this.initSwiper(tried + 1);
      setTimeout$(() => {
        this.state = 'ready'
      }, 500)
    }, 100)
  }

  setSelfHeight() {
    return setTimeout$(() => {
      const height = numFromRatio(this.elemRef.nativeElement.offsetWidth, !!this.data?.aspectRatio ? this.data?.aspectRatio : '16:9');
      this.elemRef.nativeElement.style.height =` ${height}px`;
    }, 10);
  }

  onSwiper(event) {
    console.log({ event })
    this.swiper = event;
  }

  onSwipe(event) {
    this.swiper = event
    this.swiperObj.emit(event);
    if(!!!event.autoplay?.running) this.centerCarouselInView()
  }

  centerCarouselInView() {
    const htmlElem = this.documentRef.nativeDocument.querySelector('html')
    scrollTo({ elem: this.elemRef.nativeElement, offset: 200, blockPosition: 'center', delay: 250, scrollContainer: htmlElem, behavior: 'smooth' });
  }

}
