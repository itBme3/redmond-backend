import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { sandboxOf } from 'angular-playground';
import { DEFAULT_STUDIO_FORM_BASIC } from 'projects/redmond-fire-library/src/lib/constants/contact-form';
import { SharedModule } from '../../../@shared/shared.module';
import { FormStudioConditionalInputComponent } from './form-studio-conditional-input.component';

export default sandboxOf(FormStudioConditionalInputComponent, {
  imports: [ SharedModule, BrowserAnimationsModule ]
})
  .add('default', {
    template: `<app-form-studio-conditional-input [conditions]="conditions" [formDoc]="formDoc"></app-form-studio-conditional-input>`,
    context: {
      conditions: [{
        key: 'email', operator: 'contains', value: '@',
            or: [
              { key: 'email', operator: 'contains', value: 'edu' }
            ]
      }, {
        formDoc: DEFAULT_STUDIO_FORM_BASIC
      }
        
      ]
    }
  });
