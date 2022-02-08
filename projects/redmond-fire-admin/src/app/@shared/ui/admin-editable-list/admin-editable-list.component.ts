import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';
import { animatedList } from 'projects/redmond-fire-library/src/lib/constants/animations';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-admin-editable-list',
  templateUrl: './admin-editable-list.component.html',
  styleUrls: ['./admin-editable-list.component.scss'],
  animations: animatedList
})
export class AdminEditableListComponent implements OnInit, OnDestroy {

  @Input() list: { [key: string]: any }[] | string[] | any[] = [];
  @Input() valueField: string;
  @Input() canCreate: boolean = true;
  @Input() classes: { item: string, list: string };
  @Input() sortable: boolean = true;
  @Input() doc: PageDoc

  @Output() updated = new EventEmitter<any>();
  @Output() createItem = new EventEmitter<boolean>();
  funcs = FUNCS;

  defaultClasses = {
    item: 'text-grey-dark bg-white border rounded border-gray-50 hover:border-gray-400 pl-2 pr-0 py-0',
    list: ''
  }

  removing: number = null
subscriptions: Subscription[] =[]
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.list = event.container.data;
    this.updated.emit(this.list)
  }

  public updateSubject = new Subject()

  constructor(private dialogService:DialogService, private elemRef: ElementRef) { }

  ngOnInit(): void {
    this.classes = !!!this.classes ? this.defaultClasses : { ...this.defaultClasses, ...this.classes };
  this.subscriptions.push(
    this.updateSubject.pipe(
      debounceTime(500),
      map((params: { itemIndex: number, value: string }) => {
        const { itemIndex = null, value } = params;
        if (!!!this.list[itemIndex]) return;
        typeof this.list[params.itemIndex] === 'string' ? this.list[params.itemIndex] = value : this.list[params.itemIndex][this.valueField] = value;
        return this.updated.emit(this.list);
      })
    ).subscribe())
  }

  addItem() {
    if (!Array.isArray(this.list)) this.list = [];
    if (this.canCreate !== false) {
      this.list.push(!!!this.valueField ? '...' : { [this.valueField]: '...' });
      this.updated.emit(this.list)
      FUNCS.setTimeout$(() => {
        this.elemRef.nativeElement.querySelector('.list-items .input-list-item:nth-last-child(1) input').select()
      }, 100)
    } else {
      return this.createItem.emit(true);
    }
  }

  removeItem() {
    this.list.splice(this.removing, 1);
    this.updated.emit(this.list);
    FUNCS.setTimeout$(() => {
      this.removing = null
    }, 500);
  }
  
  trackByFn(indx, item) {
    return !!item.docId ? item.docId : indx
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
