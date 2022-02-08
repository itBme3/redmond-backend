import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteRoutingModule } from './site-routing.module';
import { AdminSitePageSingleComponent } from './admin-site-page-single/admin-site-page-single.component';
import { AdminOptionsCollectionComponent } from './admin-options-collection/admin-options-collection.component';
import { AdminSitePageSingleSidebarComponent } from './admin-site-page-single/admin-site-page-single-sidebar/admin-site-page-single-sidebar.component';
import { SharedModule } from 'projects/redmond-fire-admin/src/app/@shared/shared.module';
import { AdminSiteSingleProjectComponent } from './admin-site-page-single/admin-site-single-project/admin-site-single-project.component';
import { AdminSitePageSingleSimpleComponent } from './admin-site-page-single/admin-site-page-single-simple/admin-site-page-single-simple.component';
import { AdminCollectionBulkActionsDialogComponent } from './admin-collection/admin-collection-bulk-actions/admin-collection-bulk-actions-dialog/admin-collection-bulk-actions-dialog.component';
import { AdminCollectionBulkActionsComponent } from './admin-collection/admin-collection-bulk-actions/admin-collection-bulk-actions.component';
import { AdminCollectionItemComponent } from './admin-collection/admin-collection-item/admin-collection-item.component';
import { AdminCollectionComponent, AdminCollectionPageComponent } from './admin-collection/admin-collection.component';
import { AddGridBlockComponent } from '../@shared/ui/admin-grid-blocks/add-grid-block/add-grid-block.component';
import { AdminSiteEntityFormDialogComponent } from './admin-site-entity-form/admin-site-entity-form-dialog/admin-site-entity-form-dialog.component';
import { AdminSimpleCollectionComponent } from './admin-simple-collection/admin-simple-collection.component';
import { AdminReorderingCollectionComponent } from './admin-collection/admin-reordering-collection/admin-reordering-collection.component';


@NgModule({
  declarations: [
    AdminSitePageSingleComponent,
    AdminOptionsCollectionComponent,
    AdminSitePageSingleSidebarComponent,
    AdminSiteSingleProjectComponent,
    AdminSiteEntityFormDialogComponent,
    AdminSitePageSingleSimpleComponent,
    AdminCollectionComponent,
    AdminCollectionItemComponent,
    AdminCollectionBulkActionsComponent,
    AdminCollectionBulkActionsDialogComponent,
    AddGridBlockComponent,
    AdminCollectionPageComponent,
    AdminSimpleCollectionComponent,
    AdminReorderingCollectionComponent
  ],
  entryComponents: [
    AdminSiteEntityFormDialogComponent,
    AdminCollectionBulkActionsDialogComponent,
    AddGridBlockComponent,
    AdminReorderingCollectionComponent
  ],
  imports: [
    CommonModule,
    SiteRoutingModule,
    SharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class SiteModule { }
