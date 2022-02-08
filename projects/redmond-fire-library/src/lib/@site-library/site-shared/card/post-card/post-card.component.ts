import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() doc;
  @Input() aspectRatio:string = '5:4'

  constructor() { }

  ngOnInit(): void {
  }

}