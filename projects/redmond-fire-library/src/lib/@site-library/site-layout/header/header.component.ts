import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteNavigationService } from 'projects/redmond-fire-library/src/lib/services/site-navigation.service';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DocumentRef } from '../../../services/document-ref';

export enum LogoState {
  DEFAULT = 'logo-type',
  TYPE = 'logo-type',
  ICON = 'logo-icon',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() scrolled: boolean
  @Input() overlayNav: boolean = false;
  @Input() isHomePage: boolean;

  public isHandset$: Observable<any>

  pageLinks
  subscriptions: Subscription[] = []
  rootPage

  constructor( private breakpointObserver: BreakpointObserver, public elemRef: ElementRef, private route: ActivatedRoute, private siteNav: SiteNavigationService, private documentRef: DocumentRef) {
    
  }

  async ngOnInit() {
    this.pageLinks = !!this.siteNav?.navigation ? this.siteNav.navigation.links : await this.siteNav.initSiteNavAndFooter().then(res =>  res.navigation.links)
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    return this.subscriptions.push(this.route.paramMap.subscribe((paramMap:any) => {
      this.rootPage = !!paramMap?.params?.page ? paramMap.params.page : null;
      if(!!!this.documentRef.nativeDocument?.querySelector) return;
      return this.documentRef.nativeDocument.querySelector('html').scrollTop = 0;
    }))
  }


  get logoIcon(): LogoState {
    return !!this.isHomePage ? LogoState.TYPE : LogoState.ICON;
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
