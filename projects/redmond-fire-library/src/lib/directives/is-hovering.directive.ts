import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[isHovering]'
})
export class IsHoveringDirective {

  @Output() isHovering = new EventEmitter<boolean>();

  constructor(private renderer: Renderer2, private hostElement: ElementRef) { }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter($event) {
    this.isHovering.emit(true);
    if (this.hostElement.nativeElement.classList.contains('hovering'))
      return
    this.renderer.addClass(this.hostElement.nativeElement, 'hovering');
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave($event) {
    this.isHovering.emit(false);
    if(this.hostElement.nativeElement.classList.contains('hovering'))
      this.renderer.removeClass(this.hostElement.nativeElement, 'hovering');
  }

}
