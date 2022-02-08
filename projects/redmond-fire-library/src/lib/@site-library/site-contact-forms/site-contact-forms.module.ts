import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ContactFormsComponent } from './contact-forms/contact-forms.component';
import { MatButtonModule } from '@angular/material/button';
import { SiteSharedModule } from 'projects/redmond-fire-library/src/lib/@site-library/site-shared/site-shared.module';


const components = [
  ContactFormsComponent
]

const modules = [
  MatSelectModule,
  TextFieldModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  ReactiveFormsModule,
  MatExpansionModule,
  MatButtonModule,
  SiteSharedModule
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...components,
    ...modules
  ]
})
export class SiteContactFormsModule { }
