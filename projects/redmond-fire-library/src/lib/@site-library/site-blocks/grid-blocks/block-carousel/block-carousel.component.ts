import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import Swiper from 'swiper';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-block-carousel',
  templateUrl: './block-carousel.component.html',
  styleUrls: ['./block-carousel.component.scss']
})
export class BlockCarouselComponent implements OnInit, AfterViewInit {

  @Input() block:ContentBlock
  @Output() swiperObj = new EventEmitter<Swiper>();
  @Input() blockIndex: number
  @Input() isHero: boolean = false
  defaults = {
    aspectRatio: '16:9',
    arrows: true,
    autoplay: 0
  }
  public swiper: Swiper;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit(): void {
    this.block = { ...this.defaults, ...this.block }
  }

  ngAfterViewInit() {
    
  }

  

  setSwiper(obj) {
    this.swiper = obj;
    this.swiperObj.emit(obj)
  }

 

}
