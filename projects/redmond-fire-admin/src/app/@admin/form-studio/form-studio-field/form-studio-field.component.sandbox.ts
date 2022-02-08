import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { sandboxOf } from 'angular-playground';
import { defaultStudioFormField, DEFAULT_STUDIO_FORM_BASIC } from 'projects/redmond-fire-library/src/lib/constants/contact-form';
import { SharedModule } from '../../../@shared/shared.module';
import { FormStudioFieldComponent } from './form-studio-field.component';

const defaultFields = ['email', 'radio', 'checkbox', 'textarea'].map(key => defaultStudioFormField(key, DEFAULT_STUDIO_FORM_BASIC));


export default sandboxOf(FormStudioFieldComponent, {
  imports: [SharedModule, BrowserAnimationsModule
  ]
})
  .add('default', {
    template: `
      <app-form-studio-field 
        *ngFor="let fieldObj of defaultFieldFields"
        [fieldObj]="fieldObj"></app-form-studio-field>
    `,
    context: {
      fieldObjs: defaultFields
    }
  });
