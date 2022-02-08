import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSharedModule } from '../site-shared/site-shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlockCardComponent } from './grid-blocks/block-card/block-card.component';
import { BlockWysiwygComponent } from './grid-blocks/block-wysiwyg/block-wysiwyg.component';
import { BlockCarouselComponent } from './grid-blocks/block-carousel/block-carousel.component';
import { BlockCollectionComponent } from './grid-blocks/block-collection/block-collection.component';
import { BlockEmbedComponent } from './grid-blocks/block-embed/block-embed.component';
import { GridBlocksComponent } from './grid-blocks/grid-blocks.component';

const components = [
  BlockCardComponent,
  BlockWysiwygComponent,
  BlockCarouselComponent,
  BlockCollectionComponent,
  BlockEmbedComponent,
  GridBlocksComponent,
]

@NgModule({
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ],
   schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    SiteSharedModule
  ]
})
export class SiteBlocksModule { }
