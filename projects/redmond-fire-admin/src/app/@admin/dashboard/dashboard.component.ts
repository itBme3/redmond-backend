import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ADMIN_PAGES } from 'projects/redmond-fire-library/src/lib/constants/admin-pages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  
  
  
  pages = ADMIN_PAGES
  
  subscriptions: Subscription[] = []
  

  constructor() { }

  ngOnInit(): void {
  }

  

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
