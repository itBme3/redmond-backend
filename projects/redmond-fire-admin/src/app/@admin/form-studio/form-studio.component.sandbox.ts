import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { sandboxOf } from 'angular-playground';
import { DEFAULT_STUDIO_FORM_BASIC } from 'projects/redmond-fire-library/src/lib/constants/contact-form';
import { SharedModule } from '../../@shared/shared.module';
import { FormStudioConditionalInputComponent } from './form-studio-conditional-input/form-studio-conditional-input.component';
import { FormStudioFieldComponent } from './form-studio-field/form-studio-field.component';
import { FormStudioComponent } from './form-studio.component';

export default sandboxOf(FormStudioComponent, {
  imports: [
    SharedModule,
    BrowserAnimationsModule
  ],
  declarations: [
    FormStudioFieldComponent,
    FormStudioConditionalInputComponent
  ]
})
  .add('default', {
    template: `<app-form-studio [formDoc]="formDoc"></app-form-studio>`,
    context: {
      formDoc: DEFAULT_STUDIO_FORM_BASIC
    }
  });
