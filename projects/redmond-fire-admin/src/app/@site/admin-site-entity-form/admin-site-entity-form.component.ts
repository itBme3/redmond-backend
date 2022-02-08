import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { COLLECTION_TYPE_FROM_SINGULAR, } from 'projects/redmond-fire-library/src/lib/models/collections';
import {DbService} from 'projects/redmond-fire-library/src/lib/services/db.service'
import {handleize, setTimeout$} from 'projects/redmond-fire-library/src/lib/services/funcs'
import {AdminCollectionService} from 'projects/redmond-fire-library/src/lib/services/admin-collections.service'
import { DialogService } from 'projects/redmond-fire-admin/src/app/services/dialog.service';
import { take } from 'rxjs/operators';
import { CustomInputComponent } from '../../@shared/ui/custom-input/custom-input.component';
import { SiteContentService } from '../../services/site-content.service';

@Component({
  selector: 'app-admin-site-entity-form',
  templateUrl: './admin-site-entity-form.component.html',
  styleUrls: ['./admin-site-entity-form.component.scss']
})
export class AdminSiteEntityFormComponent implements OnInit {

  @Input() doc;
  @Input() keys: string[] = []
  @Input() classes: {
    input?: string,
    expansionHeader?: string;
    expansionContainer?: string;
    expansionContent?: string;
  }
  @Input() creating: boolean = false;
  @Input() shouldSave: boolean = false;
  @Input() expandable: boolean = false;
  @Input() expanded: boolean = false;
  @Input() expansionTitle: string;

  @Output() updatedDoc = new EventEmitter<PageDoc>();
  @Output() public expansionChanged = new EventEmitter<boolean>();

  options: { [key: string]: any } = null;
  optionsCollections: any;
  project_sectors
  post_collections
  collection
  updatingHandle: boolean = false
  
  constructor(
    private collectionService: AdminCollectionService,
    private snackBar: MatSnackBar,
    private siteContent: SiteContentService,
    private dialogService: DialogService,
    private db:DbService
  ) { }

  ngOnInit(): void {
    this.collection = COLLECTION_TYPE_FROM_SINGULAR[this.doc.type]
    this.project_sectors = this.collectionService.optionsCollections.project_sectors.pipe(take(1)).toPromise().then(doc => {
      return doc.map((itm) => {
        return {value: itm.handle, label: itm.label}
      })
    });
    this.post_collections = this.collectionService.optionsCollections.post_categories.pipe(take(1)).toPromise().then(doc => {
      return doc.map((itm) => {
        return {value: itm.handle, label: itm.label}
      })
    });
  }


  updateDoc(key: string, data: { [key: string]: any }) {
    if (key === 'images' && !!!this.doc?.image?.src && !!data?.length)
      this.doc.image = data[0];
    if (key === 'handle')
      if (data === this.doc.handle) return;
    if (!!key) {
      if (['state', 'city'].includes(key)) {
        if(!!!this.doc?.locations) this.doc.locations = {};
        this.doc.location[key] = data;
      } else {
        this.doc[key] = data
      }
    } else {
      this.doc = data;
    };
    if (key === 'title' && !!this.creating) {
      this.updatingHandle = true;
      this.doc[key] = data;
      this.doc.handle = handleize(data);
      setTimeout$(() => {
        this.updatingHandle = false
      }, 500)
    }
    if (!!this.shouldSave && !!this.doc?.docPath)
      this.siteContent.updateDoc(this.doc)
        .catch(console.error);
    this.updatedDoc.emit(this.doc);
    return this.doc;
  }

}
