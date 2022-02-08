import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-element',
  templateUrl: './loading-element.component.html',
  styleUrls: ['./loading-element.component.scss'],
  inputs: ['maxWidth', 'minWidth', 'loaderMode', 'loaderColor', 'title', 'titleColor', 'cardBackground', 'cardElevation', 'cardPadding', 'bufferValue']
})
export class LoadingElementComponent implements OnInit {
  
  @Input() maxWidth: string = '600px'
  @Input() minWidth: string = '60px'
  @Input() loaderMode: string = 'buffer'
  @Input() loaderColor: string = 'dark'
  @Input() title: string = 'loading...'
  @Input() titleColor: string = 'dark'
  @Input() cardBackground: string = 'transparent'
  @Input() cardElevation: string = '01'
  @Input() cardPadding: string = '2'
  @Input() bufferValue: number = 100

  constructor() { }

  ngOnInit() {
  }

}
