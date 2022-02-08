import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { setTimeout$, tinyDoc } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { DialogService } from 'projects/redmond-fire-admin/src/app/services/dialog.service';
import { animatedList } from 'projects/redmond-fire-library/src/lib/constants/animations';
import { SiteContentService } from '../../../services/site-content.service';
import { SelectingService } from '../../../services/selecting.service';

@Component({
  selector: 'app-admin-site-single-project',
  templateUrl: './admin-site-single-project.component.html',
  styleUrls: ['./admin-site-single-project.component.scss'],
  animations: animatedList
})
export class AdminSiteSingleProjectComponent implements OnInit {

  @Input() doc
  currentImageString = null


  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.doc.images = event.container.data;
    this.updateDoc(this.doc)
  }

  removing: number = null
  editing: number =  null

  constructor(private db: DbService, private siteContent: SiteContentService, private selecting: SelectingService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.currentImageString = !!this?.doc?.images?.map ? this.doc.images.map(i => i.src).join('') : null;
    // this.db.updateAt('admin/projects/collection/test', { ...this.doc, docId: 'test', docPath: 'admin/projects/collection/test', title: 'Test Project', handle: 'test-project' })
  }

  updateDoc(doc = null) {
    return setTimeout$(() => {
      return this.siteContent.updateDoc(!!doc?.docPath?.length ? doc : this.doc).catch(console.error);
    }, 0);
  }

  addImages(event, pushImages: boolean = false) {
    const _this = this;
    this.selecting.selectMedia({
      elem: event.srcElement,
      componentParams: { multiple: true }
    }, (_selection) => {
      const selection = _selection.map(d => tinyDoc(d))
      if (!Array.isArray(this.doc.images)) this.doc.images = [];
      if (!Array.isArray(selection)) return this.doc.images;
      _this.doc.images = pushImages ? [...this.doc.images, ...selection] : [...selection, ...this.doc.images];
      _this.updateDoc(_this.doc);
    })
  }

  removeImage() {
    this.doc.images.splice(this.removing, 1);
    this.updateDoc({ images: this.doc.images, docId: this.doc.docId, docPath: this.doc.docPath });
    this.removing = null
  }

  trackByFn(indx, item) {
    return !!item?.docId?.length ? item.docId : indx
  }

}
