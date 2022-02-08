import { sandboxOf } from 'angular-playground';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { SharedModule } from 'projects/redmond-fire/src/app/@shared/shared.module';
import { CustomInputComponent } from '../../@shared/ui/custom-input/custom-input.component';
import { AdminSiteEntityFormComponent } from './admin-site-entity-form.component';

class DbMockService {
  async updateAt(path, data) {
    return console.log({ path, data })
  } 
}

export default sandboxOf(AdminSiteEntityFormComponent, {
  declarations: [CustomInputComponent],
  imports: [SharedModule],
  providers: [
    {
      provide: DbService,
      useClass: DbMockService
    }
  ]
})
  .add('default', {
    template: `
      <app-admin-site-entity-form [doc]="doc" [keys]="keys"></app-admin-site-entity-form>
    `,
    context: {
      data: {
        doc: {},
        keys: ['image', 'title', 'handle']
      },
      consoleLog(val) {
        console.log(val)
      }
    }
  });
