import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MediaDoc, EntityStatus } from 'projects/redmond-fire-library/src/lib/models/docs';
// import { SitesUploadDoc } from '../../constants/site-defaults';

export enum AdminCardStyle {
        MEDIA_ABOVE = 'media-above',
        MEDIA_ASIDE = 'media-aside',
        FULL_OVER = 'full-over',
        CONTENT_OVER = 'content-over',
        THUMB = 'thumb'
};
export interface CardInputData { 
  title?: string; 
  subtitle?: string;
  image?: MediaDoc;
  status?: EntityStatus;
  text?: string;
  metaText?: string; 
  cardClick?: Function;
  cardClasses?: string;
  contentClasses?: string;
  textClasses?: string;
  imageClasses?: string;
  cardStyle?: AdminCardStyle;
  externalContent?: boolean;
  imageAsBackground?: boolean;
  imageMaxWidth?: string;
  imageMaxHeight?: string;
  imageMinWidth?: string;
  imageMinHeight?: string;
  beforeContent?: string;
  afterContent?: string;
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  tags?: string[];
  tagClasses?: string;
  tagContainerClasses?: string;
  dark?: boolean;
  clickable?: boolean;
  columns?: number;
  }
@Component({
  selector: 'app-admin-card',
  templateUrl: './admin-card.component.html',
  styleUrls: ['./admin-card.component.scss'],
  inputs: ['data']
})
export class AdminCardComponent implements OnChanges {

  @Input() data: CardInputData

  @Output() public cardClicked = new EventEmitter<any>()
  
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      title = null,
      subtitle = null,
      image = null,
      text = null,
      metaText = null,
      cardClick = null,
      cardStyle = '1',
      cardClasses = '',
      contentClasses = '',
      textClasses = '',
      imageClasses = '',
      externalContent = false,
      imageAsBackground = true,
      imageMaxWidth = '100%',
      imageMaxHeight = 'auto',
      imageMinWidth = '30px',
      imageMinHeight = '30px',
      beforeContent = null,
      afterContent = null,
      titleTag = null,
      tags = null,
      tagClasses = '',
      tagContainerClasses = '',
      dark = false,
      clickable = true,
      columns = 2
    } = changes.data.currentValue;
    this.data = {
      title, titleTag, subtitle, 
      metaText, text, image,
      cardClick, cardStyle, externalContent,
      cardClasses, contentClasses, textClasses,
      imageClasses, imageAsBackground,
      imageMaxWidth, imageMaxHeight,
      imageMinWidth, imageMinHeight,
      beforeContent, afterContent,
      tags, tagClasses, tagContainerClasses,
      dark, clickable,
      columns
    }
  }

  get title() {
    if (!!!this.data.title) return null;
    let titleTag = !!this.data.titleTag ?
      this.data.titleTag
      : !this.data.title.includes('<h') ? 'h5' : null;
    if (!!!titleTag) return this.data.title;
    return `
      <${titleTag} class="title">
        ${ this.data.title }
      </${titleTag}>
    `
  }

  

}
