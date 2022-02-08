import { trigger, state, style, transition, animate, animateChild, group, query, keyframes } from '@angular/animations';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { UiService } from '../../../services/ui.service';


export enum CardStyle {
  STANDARD = 'standard',
  OVERLAY = 'overlay',
  TEXT = 'text',
  TESTIMONIAL = 'testimonial',
}
export const CARD_STYLES: CardStyle[] = Object.values(CardStyle);

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations:  [
    trigger('revealContent', [
      state('visible', style({
        height: 'auto',
        padding: '.25em 0'
      })),
      state('hidden', style({
        height: '0px',
        padding: '0 0',
      })),
      transition( '* => visible', [
        group([
          query('@revealContentChild', animateChild()),
          animate('0.3s ease'),
        ])
      ]),
      transition( '* => hidden', [
        group([
          query('@revealContentChild', animateChild()),
          animate('0.6s cubic-bezier(0.1, 1.22, 0.1, 1)',
            keyframes([
              style({ height: '20px', padding: '.25em 0', offset: 0 }),
              style({ height: "0px", padding: '0px', offset: 1 }),
            ])
          ),
        ])
      ] ),
    ]),
    trigger('revealContentChild', [
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(100%)'
      })),
      transition('* => visible', [
        animate('0.3s cubic-bezier(0.66, 0.04, 0, 1.01)',
          keyframes([
            style({ opacity: '0', transform: 'translateY(50%)', offset: 0 }),
            style({opacity: '.3', transform: 'translateY(10%)', offset: .8}),
            style({ opacity: '1', transform: 'translateY(0)', offset: 1 })
          ])
        )
      ]),
      transition('* => hidden', [
        animate('.3s cubic-bezier(0.66, 0.04, 0, 1.01)')
      ]),
    ]),
  ],
})
export class CardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() cardStyle: CardStyle = CardStyle.OVERLAY;
  @Input() aspectRatio: string = null;
  @Input() revealOnHover: boolean = true;
  @Input() linkPath: string = null;

  hovered: boolean = false
  public cardHeightSubject = new Subject();
  subscriptions: Subscription[] = []
  cardHeight$: Observable<string>;
  textPresent: boolean = true;

  @HostListener('window:resize')
  onResize() {
    this.cardHeightSubject.next()
  }

  constructor(private elemRef: ElementRef, private uiService: UiService) { }

  async ngOnInit() {

    this.cardHeight$ = this.cardHeightSubject.pipe(
      debounceTime(100),
      map(() => this.cardHeight)
    )

    this.subscriptions.push(this.cardHeight$.subscribe());
    


  }

  ngAfterViewInit() {

    // for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.cardHeightSubject.next();
        const title = this.elemRef.nativeElement.querySelector('[card-title]');
        this.textPresent = !!title || this.revealOnHover;
      }, 100);
    // }
  }

  get heightRatio(): number | null {
    return !!this.aspectRatio?.includes(':')
      && !!this.aspectRatio.split(':')[1] ? parseInt(this.aspectRatio.split(':')[1]) : null
  }

  get widthRatio(): number | null {
    return !!this.aspectRatio?.includes(':')
      && !!this.aspectRatio.split(':')[0] ? parseInt(this.aspectRatio.split(':')[0]) : null
  }

  get cardHeight() {
    if (!!!this.heightRatio || !!!this.widthRatio
      || !!!this.elemRef?.nativeElement?.offsetWidth)
      return 'auto';
    return (this.elemRef.nativeElement.offsetWidth / this.widthRatio * this.heightRatio) + 'px'
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }
}

