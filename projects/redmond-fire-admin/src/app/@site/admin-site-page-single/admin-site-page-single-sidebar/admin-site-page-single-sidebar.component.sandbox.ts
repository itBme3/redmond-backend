import { sandboxOf } from 'angular-playground';
import * as funcs from 'projects/redmond-fire-library/src/lib/services/funcs';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { SharedModule } from 'projects/redmond-fire/src/app/@shared/shared.module';
import { BehaviorSubject } from 'rxjs';
import { CustomInputComponent } from '../../../@shared/ui/custom-input/custom-input.component';
import { EditingEntityContentInterface, SingleEntitySidenavSectionType, SiteContentService } from '../../../services/site-content.service';
import { AdminSitePageSingleSidebarComponent } from './admin-site-page-single-sidebar.component';

class SiteContentMockService {
  _editingEntityContent: EditingEntityContentInterface = {
            editing: null, blockIndex: null, key: null, contentDocPath: null
      }
  EditingEntityContent = new BehaviorSubject<EditingEntityContentInterface>(this._editingEntityContent);
  editingEntityContent = this.EditingEntityContent.asObservable();
  funcs = funcs;
  changeEditingEntityContent(data: {
          editing?: SingleEntitySidenavSectionType,
          blockIndex?: number;
          key?: string;
          merge?: boolean
    }) {
          const currentEditingEntityContent = JSON.parse(JSON.stringify(this._editingEntityContent));
          const { merge = true } = data;
          if (!!merge) {
                Object.keys(data).filter(k => !['merge'].includes(k))
                      .forEach(key => this._editingEntityContent[key] = data[key])
          } else {
                const { blockIndex = null, key = null } = data;
                const editing: SingleEntitySidenavSectionType = typeof blockIndex === 'number' ? SingleEntitySidenavSectionType.BLOCKS : !!data.editing ? data.editing : null;
                this._editingEntityContent = { blockIndex, key, editing }
          }
          if (this.funcs.check_ObjectsAreTheSame(currentEditingEntityContent, JSON.parse(JSON.stringify(this._editingEntityContent))))
                return;
          this.EditingEntityContent.next({ ...this._editingEntityContent })
    }
}
class DbMockService {
  async updateAt(path, data) {
    return console.log({ path, data })
  } 
}

export default sandboxOf(AdminSitePageSingleSidebarComponent, {
  declarations: [CustomInputComponent],
  imports: [SharedModule],
  providers: [
    {
      provide: SiteContentService,
      useClass: SiteContentMockService,
    },
    {
      provide: DbService,
      useClass: DbMockService
    }
  ]
})
  .add('default', {
    template: `
      <app-admin-site-page-single-sidebar></app-admin-site-page-single-sidebar>
    `,
    context: {
      data: {
        inputType: 'card',
      },
      consoleLog(val) {
        console.log(val)
      }
    }
  });
