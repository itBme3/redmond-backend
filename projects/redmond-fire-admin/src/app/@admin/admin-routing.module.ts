import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploaderComponent } from '../@shared/ui/uploader/uploader.component';
import { AdminCollectionComponent } from '../@site/admin-collection/admin-collection.component';
import { AuthGuard } from '../auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TestParseClassesComponent } from './test-parse-classes/test-parse-classes.component';

const routes: Routes = [
  
  {
    path: 'site',
    loadChildren: () => import('../@site/site.module').then(m => m.SiteModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'uploads',
    component: AdminCollectionComponent,
    data: {
      collection: 'uploads',
      searchData: { path: 'uploads', filterOptionTypes: ['sort', 'status', 'mediaType'], query: { orderBy: 'updatedAt,desc', limit: 6 } },
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    children: [
      {
        path: ':docId',
        component: ManageUsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        component: ManageUsersComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'test-classes',
    component: TestParseClassesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    component: UploaderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
