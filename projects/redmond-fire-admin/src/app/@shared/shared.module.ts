import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';

import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DEFAULT_SWIPER_OPTIONS } from 'projects/redmond-fire-library/src/lib/constants/swiper-settings';
import { RouterModule } from '@angular/router';

// import { ImageLoaderDirective } from '../directives/image-loader.directive';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { LoginComponent } from './ui/login/login.component';
import { LoginEmailComponent } from './ui/login/login-email/login-email.component';
import { GoogleSigninDirective } from '../directives/google-signin.directive';
import { DropzoneDirective } from '../directives/dropzone.directive';
import { DbCollectionComponent } from './ui/db-collection/db-collection.component';
import { DbFiltersComponent } from './ui/db-collection/db-filters/db-filters.component';
import { NavigationComponent } from './layout/shell/navigation/navigation.component';
import { AdminShellComponent } from './layout/shell/shell.component';
import { DashboardComponent } from '../@admin/dashboard/dashboard.component';
import { CurrentUserComponent } from './ui/current-user/current-user.component';
import { RedmondFireLibraryModule } from 'projects/redmond-fire-library/src/lib/redmond-fire-library.module';
import { PageSingleComponent } from './pages/page-single/page-single.component';
import { PageCollectionComponent } from './pages/page-collection/page-collection.component';
import { CustomInputComponent } from './ui/custom-input/custom-input.component';
import { SelectMediaComponent, SelectMediaDialogComponent } from './ui/select-media/select-media.component';
import { DbSearchBarComponent } from './ui/db-search/db-search-bar/db-search-bar.component';
import { AdminDbSearchItemComponent, DbSearchComponent } from './ui/db-search/db-search.component';
import { AdminGridBlocksComponent } from './ui/admin-grid-blocks/admin-grid-blocks.component';
import { EditBlockOptionDialogComponent } from './ui/admin-grid-blocks/edit-block-option-dialog/edit-block-option-dialog.component';
import { EditBlockOptionMenuComponent } from './ui/admin-grid-blocks/edit-block-option-menu/edit-block-option-menu.component';
import { SimpleDialogComponent } from './ui/simple-dialog/simple-dialog.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SelectEntityComponent, SelectEntityDialogComponent } from './ui/select-entity/select-entity.component';
import { SelectedItemsSidenavComponent } from './ui/selected-items-sidenav/selected-items-sidenav.component';
import { AdminCardComponent } from './ui/admin-card/admin-card.component';
import { EditCardComponent, EditCardDialogComponent } from './ui/admin-grid-blocks/edit-card/edit-card.component';
import { TestParseClassesComponent } from '../@admin/test-parse-classes/test-parse-classes.component';
import { AutocompleteSearchComponent } from './ui/autocomplete-search/autocomplete-search.component';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { EditCarouselComponent } from './ui/admin-grid-blocks/edit-carousel/edit-carousel.component';
import { UploaderComponent, UploaderDialogComponent } from './ui/uploader/uploader.component';
import { UploaderTaskComponent } from './ui/uploader/uploader-task/uploader-task.component';
import { EntityStatusComponent } from './ui/entity-status/entity-status.component';
import { AdminOptionsCollectionSelectComponent } from '../@site/admin-options-collection/admin-options-collection-select/admin-options-collection-select.component';
import { AdminEntityHandleInputComponent } from './ui/admin-entity-handle-input/admin-entity-handle-input.component';
import { AdminEditableListComponent } from './ui/admin-editable-list/admin-editable-list.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormStudioCollectionComponent, FormStudioComponent } from '../@admin/form-studio/form-studio.component';
import { FormStudioFieldComponent } from '../@admin/form-studio/form-studio-field/form-studio-field.component';
import { FormStudioConditionalInputComponent } from '../@admin/form-studio/form-studio-conditional-input/form-studio-conditional-input.component';
import { ManageUserDialogComponent } from '../@admin/manage-users/manage-user-dialog/manage-user-dialog.component';
import { ManageUsersComponent } from '../@admin/manage-users/manage-users.component';
import { AdminSiteEntityFormComponent } from '../@site/admin-site-entity-form/admin-site-entity-form.component';
import { SelectCollectionTypeComponent } from './ui/select-entity/select-entity-type/select-collection-type.component';
import { AdminEditEmbedOptionsComponent } from './ui/admin-edit-embed-options/admin-edit-embed-options.component';
import { AdminBlockCollectionComponent } from './ui/admin-grid-blocks/admin-block-collection/admin-block-collection.component';
import { AdminInputLinkComponent } from './ui/admin-input-link/admin-input-link.component';
import { EditBlockCollectionComponent } from './ui/admin-grid-blocks/admin-block-collection/edit-block-collection/edit-block-collection.component';
import { FormatStringPipe } from 'projects/redmond-fire-library/src/lib/pipes/format-string.pipe';
import { ObjectKeysPipe } from 'projects/redmond-fire-library/src/lib/pipes/object-keys.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AdminEditCollectionFiltersComponent } from '../@site/admin-collection/admin-edit-collection-filters/admin-edit-collection-filters.component';


const components = [
  FooterComponent,
  LoginComponent,
  LoginEmailComponent,
  GoogleSigninDirective,
  DropzoneDirective,
  DbCollectionComponent,
  DbFiltersComponent,
  AdminShellComponent,
  NavigationComponent,
  DashboardComponent,
  CurrentUserComponent,
  PageSingleComponent,
  PageCollectionComponent,
  CustomInputComponent,
  SelectMediaComponent,
  DbSearchComponent,
  AdminDbSearchItemComponent,
  DbSearchBarComponent,
  AdminGridBlocksComponent,
  EditBlockOptionDialogComponent,
  EditBlockOptionMenuComponent,
  SimpleDialogComponent,
  SelectEntityComponent,
  SelectEntityDialogComponent,
  SelectedItemsSidenavComponent,
  AdminCardComponent,
  EditCardComponent,
  EditCardDialogComponent,
  TestParseClassesComponent,
  AutocompleteSearchComponent,
  UploaderComponent,
  UploaderDialogComponent,
  UploaderTaskComponent,
  EditCarouselComponent,
  EntityStatusComponent,
  AdminOptionsCollectionSelectComponent,
  AdminEntityHandleInputComponent,
  AdminEditableListComponent,
  SelectMediaDialogComponent,
  FormStudioCollectionComponent,
  FormStudioComponent,
  FormStudioFieldComponent,
  FormStudioConditionalInputComponent,
  ManageUserDialogComponent,
  ManageUsersComponent,
  AdminSiteEntityFormComponent,
  SelectCollectionTypeComponent,
  AdminEditEmbedOptionsComponent,
  AdminBlockCollectionComponent,
  AdminInputLinkComponent,
  EditBlockCollectionComponent,
  FormatStringPipe,
  ObjectKeysPipe,
  AdminEditCollectionFiltersComponent
];
const modules = [
  RedmondFireLibraryModule,
  CommonModule,
  MatDialogModule,
  MatIconModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatStepperModule,
  TextFieldModule,
  MatCheckboxModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatListModule,
  MatSnackBarModule,
  MatDialogModule,
  ReactiveFormsModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatSidenavModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatSliderModule,
  OverlayModule,
  RouterModule,
  NgScrollbarModule,
  DragDropModule,
  CKEditorModule,
  ClipboardModule
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    ...modules,
  ],
  exports: [
    ...modules,
    ...components
  ],
  entryComponents: [
    EditBlockOptionDialogComponent,
    SimpleDialogComponent,
    EditBlockOptionMenuComponent,
    SelectEntityDialogComponent,
    EditCardDialogComponent,
    SelectMediaDialogComponent,
    ManageUserDialogComponent,
    SelectCollectionTypeComponent,
    UploaderDialogComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    },
    {
      provide: MatDialogRef,
      useValue: null
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: null
    },
    {
        provide: SWIPER_CONFIG,
        useValue: DEFAULT_SWIPER_OPTIONS
    }
  ]
})
export class SharedModule { }
