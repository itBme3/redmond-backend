import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AdminSitePageSingleComponent } from './admin-site-page-single/admin-site-page-single.component';
import { AdminCollectionPageComponent } from './admin-collection/admin-collection.component';
import { AdminSimpleCollectionComponent } from './admin-simple-collection/admin-simple-collection.component';
import { SimpleCollectionResolver } from '../resolvers/simple-collection.resolver';

const routes: Routes = [
  {
    path: 'preview',
    loadChildren: () => import('./@previewing/previewing.module').then(m => m.PreviewingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'projects',
    children: [
      {
        path: 'previewing',
        loadChildren: () => import('./@previewing/previewing.module').then(m => m.PreviewingModule)
      },
      {
        path: ':docId',
        component: AdminSitePageSingleComponent,
        data: {
          collection: 'projects',
        },
        canActivate: [AuthGuard]
      },
      {
        component: AdminCollectionPageComponent,
        path: '',
        pathMatch: 'full',
        data: {
          collection: 'projects',
          searchData: {
            path: 'admin/projects/collection',
            filterOptionTypes: ['sort', 'status', 'sector'],
            query: { orderBy: 'order,asc', limit: 10 }
          }
        },
        canActivate: [AuthGuard]
      }
    ],
  },
  {
    path: 'posts',
    children: [
      {
        path: ':docId',
        component: AdminSitePageSingleComponent,
        data: {
          collection: 'posts'
        },
        canActivate: [AuthGuard]
      },
      {
        component: AdminCollectionPageComponent,
        path: '',
        pathMatch: 'full',
        data: {
          collection: 'posts',
          searchData: {
            path: 'admin/posts/collection',
            filterOptionTypes: ['sort', 'status', 'category'],
            query: { orderBy: 'publishedAt,desc', limit: 10 }
          }
        },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'pages',
    children: [
      {
        path: ':docId',
        component: AdminSitePageSingleComponent,
        data: {
          collection: 'pages'
        },
        canActivate: [AuthGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        component: AdminCollectionPageComponent,
        data: {
          collection: 'pages',
          searchData: {
            path: 'admin/pages/collection',
            filterOptionTypes: ['sort', 'status'], query: { orderBy: 'createdAt,desc', limit: 10 } },
        },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'team',
    children: [
      {
        path: ':docId',
        component: AdminSitePageSingleComponent,
        data: {
          collection: 'team'
        },
        canActivate: [AuthGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        component: AdminCollectionPageComponent,
        data: {
          collection: 'team',
          searchData: {
            path: 'admin/team/collection',
            filterOptionTypes: ['sort'],
            query: { orderBy: 'createdAt,desc', limit: 10 }
          },
        },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'uploads',
    component: AdminCollectionPageComponent,
    data: {
      collection: 'uploads',
      searchData: {
        path: 'uploads',
        filterOptionTypes: ['sort'],
        query: { orderBy: 'createdAt,desc', limit: 20 }
      },
    },
    canActivate: [AuthGuard]
  },
  ...['navigation', 'footer', 'hiring'].map(collection => {
    return {
      path: collection,
      component: AdminSimpleCollectionComponent,
      data: {
        collection,
        listKey: collection === 'hiring' ? 'jobs' : collection === 'footer' ? 'items' : 'links'
      },
      resolve: {
        doc: SimpleCollectionResolver,
      },
      canActivate: [AuthGuard]
    }
  }),
  
  {
    path: '',
    component: AdminSitePageSingleComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
