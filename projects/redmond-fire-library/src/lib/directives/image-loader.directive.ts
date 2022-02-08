import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Attribute, Directive, ElementRef, HostListener, Inject, Input, OnDestroy, PLATFORM_ID, Renderer2, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaDoc } from '../models/docs';
import { setTimeout$ } from '../services/funcs';
import { UiService } from '../services/ui.service';
import { WindowRef } from '../services/window-ref';

@Directive({
  selector: '[imageLoader]'
})
export class ImageLoaderDirective implements AfterViewInit, OnDestroy {

  originalSrc
  originalImageElem
  elemWidth: number
  @Input() aspectRatio: string; /* 5:4 */
  @Input() thumbs: { [key: string]: string };
  @Input() isBackground: boolean = false;
  @Input() image: MediaDoc = null;

  subscriptions: Subscription[] = [];
  isBrowser: boolean;
  
  constructor(
    @Attribute('src') public src: string,
    private renderer: Renderer2,
    private uiService: UiService,
    private el: ElementRef,
    private winRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object) {
    this.subscriptions.push(this.uiService.resetSizing.subscribe(() => this.setImage()));
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.renderer.addClass(this.el.nativeElement.parentNode, 'image-is-loading');
    this.renderer.addClass(this.el.nativeElement.parentNode, 'image-wrapper');
    this.renderer.addClass(this.el.nativeElement.parentNode, 'loader-static');
    if (!!!this.el.nativeElement) return;
    this.setImage();
  }

  @HostListener('load') onLoad() {
    this.setImage();
    setTimeout$(() => {
      this.renderer.removeClass(this.el.nativeElement.parentNode, 'loader-static');
      this.renderer.removeClass(this.el.nativeElement.parentNode, 'image-is-loading');
    } ,0)
  }

  @HostListener('window:resize') onResize() {
    this.setImage();
  }

  setImage() {
    if (!this.isBrowser) return;
    setTimeout$(() => {
      if (!!!this.originalSrc)
        this.originalSrc = !!this.image?.src ? this.image.src : !!this.el?.nativeElement?.src ? this.el.nativeElement.src : null;
      if (!!!this.originalImageElem)
        this.originalImageElem = this.el.nativeElement;
      this.setHeight();
      const newSrc = this.getSrc();
      if (this.el.nativeElement.src !== newSrc)
        this.renderer.setAttribute(this.el.nativeElement, 'src', newSrc);
      if (!!!this.isBackground) return;
      this.renderer.setStyle(this.el.nativeElement.parentElement, 'background-image', `url('${newSrc}')`);
      if (!this.el.nativeElement.getAttribute('class')?.includes('invisible')) {
        this.renderer.addClass(this.el.nativeElement, 'invisible');
        this.renderer.addClass(this.el.nativeElement.parentNode, 'bg-image');
      }
    }, 10 )
  }

  setHeight() {
    this.elemWidth = this.el.nativeElement.parentNode.offsetWidth;
    if (!!!this.aspectRatio) return;
    if(Array.isArray(this.aspectRatio)) this.aspectRatio = this.aspectRatio.join(':');
    this.renderer.setStyle(this.el.nativeElement.parentNode, 'height', `${Math.ceil(this.elemWidth / parseInt(this.aspectRatio.split(':')[0]) * parseInt(this.aspectRatio.split(':')[1]))}px`);
    this.renderer.setStyle(this.el.nativeElement.parentNode, 'background-image', `url(${this.el.nativeElement.src})`);
  }

  getSrc() {
    if (!!!this.thumbs || !!!this.elemWidth) return this.originalSrc;
    const elemWidth = this.el.nativeElement.parentNode.offsetWidth;
    const devicePixelRatio = this.winRef?.nativeWindow.hasOwnProperty('devicePixelRatio') ? this.winRef.nativeWindow.devicePixelRatio : 1;
    const resWidth = elemWidth * devicePixelRatio;
    const elemHeight = this.el.nativeElement.parentNode.offsetWidth;
    const resHeight = elemHeight * devicePixelRatio;
    const isPortrait = resHeight > resWidth;
    const smallestThumbSize: string = Object.keys(this.thumbs)
      .filter(size => parseInt(size) > (resWidth * (isPortrait ? 2 : 1)))
      .sort((a, b) => +a - +b)[0];
    if (!!smallestThumbSize) return this.thumbs[smallestThumbSize];
    return this.originalSrc
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }

}


