import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleResponsiveComponent } from './components/site/toggle-responsive/toggle-responsive.component';
import { PreviewPageComponent } from './components/site/page/page.component';


import { SiteLayoutModule } from './@site-library/site-layout/site-layout.module';
import { SitePostsModule } from './@site-library/site-posts/site-posts.module';
import { SiteProjectsModule } from './@site-library/site-projects/site-projects.module';
import { SiteSharedModule } from './@site-library/site-shared/site-shared.module';
import { SiteBlocksModule } from './@site-library/site-blocks/site-blocks.module';

const components = [
  
  ToggleResponsiveComponent,
  
  PreviewPageComponent,
  
]

const libraryModules = [
  SiteLayoutModule,
  SiteBlocksModule,
  SitePostsModule,
  SiteProjectsModule,
  SiteSharedModule,
]


@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ...libraryModules,
  ],
  entryComponents: [],
  exports: [...components, ...libraryModules],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  
})
export class RedmondFireLibraryModule { }
