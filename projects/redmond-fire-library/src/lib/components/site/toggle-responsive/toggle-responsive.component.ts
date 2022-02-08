import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenBreakpoint } from '../../../models/responsive';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-toggle-responsive',
  templateUrl: './toggle-responsive.component.html',
  styleUrls: ['./toggle-responsive.component.scss']
})
export class ToggleResponsiveComponent implements OnInit {

  @Input() responsive: ScreenBreakpoint = ScreenBreakpoint.DEFAULT
  @Output() public updated = new EventEmitter<ScreenBreakpoint>();
  responsiveWidth: string | null;
  // subscriptions: Subscription[] = [];

  constructor(
    // private breakpointService: BreakpointService
  ) { }

  ngOnInit(): void {
    // this.subscriptions.push(this.breakpointService.responsive.subscribe(responsive => this.responsive = responsive))
  }

  toggleResponsive(size) { 
    this.responsive = size;
    this.updated.emit(size)
  }

  // ngOnDestroy() {
  //   this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe : '')
  // }

}
