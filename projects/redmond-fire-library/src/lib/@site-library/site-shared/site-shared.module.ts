import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TestimonialCardComponent } from './card/testimonial-card/testimonial-card.component';
import { TeamCardComponent } from './card/team-card/team-card.component';
import { TeamCardDialogComponent } from './card/team-card/team-card-dialog/team-card-dialog.component';
import { WysiwygEditorComponent } from '../../@site-library/site-shared/wysiwyg-editor/wysiwyg-editor.component';
import { LoadingElementComponent } from '../../@site-library/site-shared/loading-element/loading-element.component';
import { CardComponent } from './card/card.component';
import { ImageLoaderDirective } from '../../directives/image-loader.directive';
import { CarouselComponent } from '../../@site-library/site-shared/carousel/carousel.component';
import { ObjectKeysPipe } from '../../pipes/object-keys.pipe';
import { IsHoveringDirective } from '../../directives/is-hovering.directive';
import { OnVisibleDirective } from '../../directives/on-visible.directive';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import SwiperCore, { Navigation, Pagination, Scrollbar, Thumbs, Autoplay } from 'swiper/core';
SwiperCore.use([Navigation, Pagination, Scrollbar, Thumbs, Autoplay]);
import { SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { DocumentRef } from '../../services/document-ref';
import { WindowRef } from '../../services/window-ref';
import { DEFAULT_SWIPER_OPTIONS } from '../../constants/swiper-settings';
import { DbService } from '../../services/db.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostCardComponent } from './card/post-card/post-card.component';
import { ProjectCardComponent } from './card/project-card/project-card.component';
import { SafeHtmlPipe } from 'projects/redmond-fire-library/src/lib/pipes/safe-html.pipe';
import { MatSelectModule } from '@angular/material/select';
import { CollectionFilterComponent } from 'projects/redmond-fire-library/src/lib/@site-library/site-shared/collection-filter/collection-filter.component';
import { SafeUrlPipe } from 'projects/redmond-fire-library/src/lib/pipes/safe-url.pipe';




const components = [
  LoadingElementComponent,
  TestimonialCardComponent,
  TeamCardComponent,
  TeamCardDialogComponent,
  WysiwygEditorComponent,
  CarouselComponent,
  CardComponent,
  PostCardComponent,
  ProjectCardComponent,
  ImageLoaderDirective,
  IsHoveringDirective,
  OnVisibleDirective,
  FourOhFourComponent,
  PageHeaderComponent,
  SafeHtmlPipe,
  SafeUrlPipe,
  CollectionFilterComponent
]

const modules = [
  RouterModule,
  NgxPicaModule,
  SwiperModule,
  HttpClientModule,
  CKEditorModule,
]


const materialModules = [
  MatProgressBarModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatTooltipModule,
  OverlayModule,
  MatSelectModule
]

@NgModule({
  declarations: [
    ...components
  ],
  exports: [
    ...components,
    ...modules,
    ...materialModules,
  ],
  imports: [
    CommonModule,

    ...modules,
    ...materialModules,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    TeamCardDialogComponent
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_OPTIONS
    },
    WindowRef,
    DocumentRef,
    DbService
  ]
})
export class SiteSharedModule { }
