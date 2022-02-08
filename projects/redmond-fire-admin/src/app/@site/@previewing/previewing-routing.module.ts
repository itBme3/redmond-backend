import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewPageComponent } from 'projects/redmond-fire-library/src/lib/components/site/page/page.component';
import { SiteCollectionQueryResolver } from 'projects/redmond-fire-library/src/lib/resolvers/site-collection-query.resolver';
import { SiteCollectionResolver } from 'projects/redmond-fire-library/src/lib/resolvers/site-collection.resolver';
import { SitePageResolver } from 'projects/redmond-fire-library/src/lib/resolvers/site-page.resolver';
import { PostType } from 'projects/redmond-fire-library/src/lib/models/collections';

const routes: Routes = [
  {
    path: 'home',
    component: PreviewPageComponent,
    data: {
      isHomepage: true,
    },
    resolve: {
      doc: SitePageResolver
    }
  },
  ...[ 'projects', 'pages', ...Object.values(PostType) ].map(collection => {
    return {
      path: collection,
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: PreviewPageComponent,
          data: { collection },
          resolve: {
            collectionDoc: SiteCollectionResolver,
            dbQuery: SiteCollectionQueryResolver
          }
        },
        // {
        //   path: `${collection}/:handle`,
        //   component: PageComponent,
        //   data: { collection },
        //   resolve: {
        //     doc: SitePageResolver
        //   }
        // },
        {
          path: `:handle`,
          component: PreviewPageComponent,
          data: { collection },
          resolve: {
            doc: SitePageResolver
          }
        }
      ]
    }
  })

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewingRoutingModule { }
