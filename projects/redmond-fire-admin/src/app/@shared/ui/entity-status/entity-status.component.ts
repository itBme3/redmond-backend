import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EntityStatus, ENTITY_STATUS_COLORS, PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';
import { SiteContentService } from '../../../services/site-content.service';

@Component({
  selector: 'app-entity-status',
  templateUrl: './entity-status.component.html',
  styleUrls: ['./entity-status.component.scss']
})
export class EntityStatusComponent implements OnInit, OnChanges {

  @Input() data: { doc: PageDoc | { status: EntityStatus, [key:string]: any }, context?: 'indicator' | 'select' | 'buttons', confirm?: boolean, save?: boolean };
  @Output() updated = new EventEmitter<EntityStatus>()

  @ViewChild('statusInput') statusElem

  statusColors = ENTITY_STATUS_COLORS
  status:EntityStatus
  emitUpdate$: Observable<any>
  updateSubject = new Subject();
  dialogOpened: boolean = false
  funcs = FUNCS
  confirmStatus: EntityStatus = null
  entityStatus = EntityStatus
  
  constructor(
    private siteContent: SiteContentService, public elemRef: ElementRef) { }

  ngOnInit() {
    this.status = !!this.data?.doc?.status ? this.data.doc.status : EntityStatus.DRAFT
    this.emitUpdate$ = this.updateSubject.pipe(
      debounceTime(100),
      map((status) => {
        if (!!this.dialogOpened) return;
        this.dialogOpened = true;
        return this.updateStatus(`${status}`);
      }),
      // shareReplay()
    )
    this.emitUpdate$.subscribe()
  }
  ngOnChanges(changes: SimpleChanges): void {
    const { save = true, context = 'select', confirm = false } = changes.data.currentValue;
    const data = { ...this.data, save, context, confirm };
    if(!this.funcs.check_ObjectsAreTheSame(changes.data.currentValue, data))
      this.data = { ...this.data, save, context, confirm };
  }


  updateDoc() {
    return FUNCS.setTimeout$(() => {
      return this.siteContent.updateDoc(this.data.doc, this.data.doc.status === EntityStatus.PUBLISHED)
        .catch(console.error)
    }, 0)
  }

  emitUpdate() {
    FUNCS.setTimeout$(() => {
      this.updated.emit(this.data.doc.status)
    }, 0)
  }

  saveChanges() {
    this.data.doc.status = EntityStatus.PUBLISHED;
    this.data.doc.savedAt = Date.now();
    this.updateDoc();
    this.emitUpdate();
  }

  updateStatus(status) {
    this.data.doc.status = status;
    this.confirmStatus = null;
    this.updateDoc();
    this.emitUpdate();
  }

}


