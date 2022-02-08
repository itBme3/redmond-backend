import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';
import { ScrollingService } from './services/scrolling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'Redmond Construction (DEV)';

  constructor() { }

  
}
