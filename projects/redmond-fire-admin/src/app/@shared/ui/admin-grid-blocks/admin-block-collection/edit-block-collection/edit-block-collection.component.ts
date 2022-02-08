import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectingService } from 'projects/redmond-fire-admin/src/app/services/selecting.service';
import { SiteContentService } from 'projects/redmond-fire-admin/src/app/services/site-content.service';
import { setTimeout$, tinyDoc } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';

@Component({
  selector: 'app-edit-block-collection',
  templateUrl: './edit-block-collection.component.html',
  styleUrls: ['./edit-block-collection.component.scss']
})
export class EditBlockCollectionComponent implements OnInit {

  @Input() doc
  @Input() block
  @Input() blockIndex
  @Input() shouldSave: boolean = true

  confirmRemove:number = null;

  @Output() updated = new EventEmitter<ContentBlock>()

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.doc.blocks[this.blockIndex].items = event.container.data;
    this.block = this.doc.blocks[this.blockIndex];
    this.updated.emit(this.block);
  }

  constructor(private selecting: SelectingService, private siteContent: SiteContentService) { }

  ngOnInit(): void {
    if (!!!this.block && !!this.doc && typeof this.blockIndex === 'number' && !!this.doc?.blocks?.length)
      this.block = this.doc.blocks[this.blockIndex]
  }

  updateDoc() {
    return setTimeout$(() => {
      this.siteContent.updateDoc(this.doc);
      this.updated.emit(this.block)
    }, 0)
  }

  addItems(event) {
    this.selecting.selectEntity({ multiple: true, elem: event.srcElement, selected: this.block.items }, (selection) => {
      if (!!!selection || !!!selection?.length || !Array.isArray(selection)) return;
      this.doc.blocks[this.blockIndex].items = selection.map(d => tinyDoc(d));
      if (!!this.shouldSave) this.siteContent.updateDoc(this.doc);
      this.updated.emit(this.doc.blocks[this.blockIndex])
    })
  }

  removeItem(i) {
    this.block.items.splice(i, 1);
    this.doc.blocks[this.blockIndex] = this.block;
    this.confirmRemove = null;
    this.updateDoc();
  }

  trackByFn(item, index) {
    return !!item?.docId?.length ? item.docId : index
  }

}
