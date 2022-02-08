import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import {  Component,  Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, map, shareReplay, take } from 'rxjs/operators';
import { asyncDelay, setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { BreakpointService } from 'projects/redmond-fire-library/src/lib/services/breakpoint.service';
// import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  inputs: ['context']
})
export class AdminShellComponent implements OnInit, OnDestroy {

  @Input() context: 'root' | 'sub' = 'root'
  hoveringNav:any = false
  subNav: string | false;
  navCollapsed: boolean = true;
  closingNav: boolean = false;
  isHandset$: Observable<boolean>;
  subscriptions: Subscription[] = [];
  navWidth$ = new ReplaySubject();
  mainContentOffset: number = 50
  @Output() navWidth = new EventEmitter<number>()

  @ViewChild('adminNavigation') adminNavWrapper;

  @HostListener('window:resize')
  onResize() {
    this.setNavWidth();
    this.setResponsive();
  }

  constructor(private breakpointObserver: BreakpointObserver, private breakpointService: BreakpointService, public elemRef: ElementRef) {
    
  }

  ngOnInit() {
    this.setResponsive();

    this.navWidth$.pipe(
      debounceTime(20),
      shareReplay(),
      map(async (width: number) => {
        const isHandset = await this.isHandset$.pipe(take(1)).toPromise();
        this.mainContentOffset = !!!isHandset ? this.adminNavWrapper.nativeElement.offsetWidth : 0;
        return this.navWidth.next(width);
      })
    );

    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches),
      shareReplay()
    );

  }

  async ngAfterViewInit() {
    for (let i = 0; i < 50; i++) {
      await (async () => {
        if(!!!this?.adminNavWrapper?.nativeElement?.offsetWidth)
        return await asyncDelay(50);
      })();
      if (!!this.adminNavWrapper.nativeElement.offsetWidth)
        return this.setNavWidth();
    }
  }

  setResponsive() {
    this.breakpointService.setResponsive(this.elemRef.nativeElement.offsetWidth);
  }

  setNavWidth() {
    return setTimeout$(() => {

      if (!!!this.adminNavWrapper?.nativeElement?.offsetWidth) 
        return this.isHandset$.pipe(take(1)).toPromise()
          .then(isHandset => this.navWidth$.next(!!isHandset || !this.navCollapsed ? 76 : 50))
          .catch(console.error);
      this.navWidth$.next(Math.ceil(this.adminNavWrapper.nativeElement.offsetWidth));
    }, 25)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
