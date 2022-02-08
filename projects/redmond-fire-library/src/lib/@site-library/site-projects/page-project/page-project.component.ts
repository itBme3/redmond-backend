import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwiperComponent } from 'ngx-swiper-wrapper';
import { CollectionDoc } from 'projects/redmond-fire-library/src/lib/models/collections';
import { CollectionsService } from 'projects/redmond-fire-library/src/lib/services/collections.service';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { Subscription, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { PageService } from 'projects/redmond-fire/src/app/services/page.service';

@Component({
  selector: 'app-page-project',
  templateUrl: './page-project.component.html',
  styleUrls: ['./page-project.component.scss']
})
export class PageProjectComponent implements OnInit, OnDestroy {
  @Input() doc:any // project document

  @Input() handle: any
  
  collectionDoc: CollectionDoc
  sectorMap: {[key:string]:any}
  

  subscriptions: Subscription[] = []
  public verticalDevice$: Observable<any>
  
  public isHandset$: Observable<any>
  swiper: SwiperComponent;

  constructor(private route: ActivatedRoute, private breakpointObserver: BreakpointObserver, private collectionService: CollectionsService, private uiService: UiService, private pageService: PageService) { }

  async ngOnInit() {
    
    this.uiService.setHasOverlayNav(false)

    this.verticalDevice$ = this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait, 
    ]).pipe(
      map(result => result.matches),
      shareReplay()
    );
    
    this.subscriptions.push(this.route.data.subscribe((data: any) => {
      this.handle = data.handle;
      this.doc = null;
      return this.subscriptions.push(this.pageService.getPageDoc({collection: 'projects', handle: this.handle})
        .pipe(tap(doc => this.doc = doc )).subscribe())
    }));

    setTimeout$(() => {
      if (this.collectionService?.collectionDocs?.projects?.pipe) {
        this.collectionService.collectionDocs.projects.pipe(take(1)).toPromise().then(doc => {
          this.collectionDoc = doc;
          this.sectorMap = doc.filters.sectors.reduce((acc, sector) => {
            return {...acc, [sector.handle]: sector.label}
          }, {})
        });
      }
    }, 0);
    return 
  }

  setSwiper(event) {
    this.swiper = event;
  }



  ngOnDestroy() {
    this.subscriptions.forEach( s => !!s?.unsubscribe ? s.unsubscribe() : '' )
  }

}
