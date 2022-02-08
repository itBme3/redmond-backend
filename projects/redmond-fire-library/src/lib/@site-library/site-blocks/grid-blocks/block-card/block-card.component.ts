import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { CardStyle } from '../../../site-shared/card/card.component';

@Component({
  selector: 'app-block-card',
  templateUrl: './block-card.component.html',
  styleUrls: ['./block-card.component.scss']
})
export class BlockCardComponent implements OnInit {

  @Input() block: ContentBlock
  @Input() hidden: boolean = false
  @Input() revealOnHover: boolean = true
  @Input() cardStyle: CardStyle
  @Input() aspectRatio: string = '1:1'

  @ViewChild('appCard') theCard

  constructor(private router: Router, private location: Location) { }

  ngOnInit(): void {
    if (!!this.block?.aspectRatio?.length)
      this.aspectRatio = this.block.aspectRatio;
    setTimeout$(() => {
      !!this.theCard?.cardHeightSubject?.next ? this.theCard.cardHeightSubject.next() : '';
    }, 4000);
  }

  cardClicked() {
    if (!!this.block?.link) {
      if (!!!this.block.link.includes('.'))
        return this.router.navigateByUrl(this.block.link);
      this.location.go(this.block.link);
    }
  }

}
