import { Location } from '@angular/common';
import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';


@Component({
  selector: 'site-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, AfterViewInit, OnDestroy {

  isHomePage: boolean;
  scrolled: boolean
  overlayNav: boolean = false
  prevScrollPosition = 0;



  scrollSubject = new Subject();

  @HostListener('window:scroll', [`$event`])
  onScroll(_event) {
    const htmlElem = _event.target.querySelector('html');
    this.scrolled = htmlElem.scrollTop > 20;
    this.scrollSubject.next(_event)
  }

  @HostListener('window:resize', [`$event`])
  onResize(_event) {
    this.setScrollbarWidth();
  }

  @ViewChild('appHeader') headerElem;
  @ViewChild('main') mainElem;
  subscriptions: Subscription[] = []
  scrollbarWidth:string = '0px'
  
  constructor(private uiService: UiService, private router: Router, private location: Location ) { }

  ngOnInit(): void {
  

    this.router.events.subscribe(event => {
      this.isHomePage = !!!this.location.path(false)?.length
    });

    this.subscriptions.push(this.uiService.hasOverlayNav.subscribe((val: boolean) => {
      this.overlayNav = val;
    }));

    this.subscriptions.push(this.scrollSubject.pipe(
      debounceTime(5),
      map((event:any) => {
        const html = event.target.querySelector('html');
        this.scrolled = html.scrollTop >= 20;
      })
    ).subscribe())
  }


  ngAfterViewInit() {
    setTimeout$(() => {
      this.setScrollbarWidth();
    }, 0)
  }


  setScrollbarWidth() {
    this.scrollbarWidth = `${this.uiService.getScrollbarWidth()}px`;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }


}
