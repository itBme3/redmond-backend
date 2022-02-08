import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageProjectComponent } from './page-project/page-project.component';
import { RouterModule } from '@angular/router';
import { CollectionProjectsComponent } from './collection-projects/collection-projects.component';
import { SiteSharedModule } from 'projects/redmond-fire-library/src/lib/@site-library/site-shared/site-shared.module';

const components = [
  PageProjectComponent,
  CollectionProjectsComponent,
]
@NgModule({
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ],
  imports: [
    CommonModule,
    RouterModule,
    SiteSharedModule,
  ]
})
export class SiteProjectsModule { }
