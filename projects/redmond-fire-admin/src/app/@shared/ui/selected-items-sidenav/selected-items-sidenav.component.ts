import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { AdminCardStyle } from '../admin-card/admin-card.component';
// import { AdminCardStyle } from '../../constants/site-defaults';

@Component({
  selector: 'app-selected-items-sidenav',
  templateUrl: './selected-items-sidenav.component.html',
  styleUrls: ['./selected-items-sidenav.component.scss']
})
export class SelectedItemsSidenavComponent implements OnInit {

  @Input() data: SelectedItemsInputData
  
  defaultData:SelectedItemsInputData = {
      selected: [],
      containerClasses: 'bg-transparent',
      sidenavClasses: 'bg-transparent',
      contentClasses: 'bg-transparent',
      mode: 'side',
      position: 'end',
      fixedInViewport: true,
      showSelected: true,
      cardStyle: AdminCardStyle.MEDIA_ASIDE
    }
  
  @Output() public showingSelected = new EventEmitter<boolean>();
  @Output() public selectionChanged = new EventEmitter<any[]>();
  @Output() public saved = new EventEmitter<any[]>();
  @Output() public canceled = new EventEmitter<any[]>();

  
  isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  removing: number = null
  
  
  constructor(private breakpointObserver: BreakpointObserver) {
    this.data = this.defaultData;
    
  }

  ngOnInit(): void {
    this.data = {
      ...this.defaultData,
      ...this.data,
    }
  }

  get showSelected() {
    return !!this.data?.showSelected
  }

  set showSelected(val) {
    this.data.showSelected = val;
  }

  removeItem(indx) {
    this.data.selected.splice(indx, 1);
    this.selectionChanged.emit(this.data.selected)
  }

}


export interface SelectedItemsInputData {
    selected?: any[];
    mode?: 'side' | 'over';
    position?: 'start' | 'end';
    fixedInViewport?: boolean;
    showSelected?: boolean;
    cardStyle?: AdminCardStyle;
      hideToolbar?: boolean
      hideCancel?: boolean;
      hideSubmit?: boolean;
      containerStyles?: { [key: string]: any };
      contentStyles?: { [key: string]: any };
      sidenavStyles?: { [key: string]: any };
      containerClasses: string;
      contentClasses?: string;
      sidenavClasses?: string;
      cardClasses?: string;
      cardContentClasses?: string;
  }

  
