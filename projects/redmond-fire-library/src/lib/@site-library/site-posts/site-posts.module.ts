import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionPostsComponent } from './collection-posts/collection-posts.component';
import { PagePostComponent } from './page-post/page-post.component';
import { SiteSharedModule } from 'projects/redmond-fire-library/src/lib/@site-library/site-shared/site-shared.module';

const components = [
  CollectionPostsComponent,
  PagePostComponent
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
    SiteSharedModule
  ]
})
export class SitePostsModule { }
