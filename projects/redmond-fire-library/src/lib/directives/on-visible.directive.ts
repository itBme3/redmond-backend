import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[onVisible]'
})
export class OnVisibleDirective implements AfterViewInit, OnDestroy {

  lastEmit:number = 0;

  @Output() public onVisible: EventEmitter<any> = new EventEmitter();

  private _intersectionObserver?: IntersectionObserver;

  
  constructor(private _element: ElementRef) { }

  public ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      this._intersectionObserver = new IntersectionObserver(entries => {
        this.checkForIntersection(entries);
      }, {});
      this._intersectionObserver.observe(<Element>this._element.nativeElement);
      this._intersectionObserver.thresholds
    }
  }

  public ngOnDestroy() {
    if(!!this._intersectionObserver?.disconnect) this._intersectionObserver.disconnect();
  }

  private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const isIntersecting = (<any>entry).isIntersecting && entry.target === this._element.nativeElement;
      
      if (isIntersecting) {
        this.onVisible.emit();
      }
    });
  };
}
