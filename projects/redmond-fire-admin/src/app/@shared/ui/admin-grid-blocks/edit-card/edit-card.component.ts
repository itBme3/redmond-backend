import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import {  COLLECTION_TYPE_FROM_SINGULAR } from 'projects/redmond-fire-library/src/lib/models/collections';
import { BreakpointService } from 'projects/redmond-fire-library/src/lib/services/breakpoint.service';
import { ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';
import {ParseClasses} from 'projects/redmond-fire-library/src/lib/services/parse-class-names';
import { debounceTime, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectingService } from 'projects/redmond-fire-admin/src/app/services/selecting.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnInit, OnDestroy {

  @Input() block: ContentBlock
  @Output() updated = new EventEmitter<ContentBlock>()

  parseClasses = new ParseClasses()
  updatingClassValues: boolean = false
  responsive: ScreenBreakpoint;
  subscriptions: Subscription[] = []
  updateSubject = new Subject()

  optionKeys = ['image', 'title', 'text', 'linkText', 'link']

  textInputKeys = ['title', 'text', 'linkText']
  initImage: boolean = false;

  inactiveKeys: string[] = []

  constructor(private db: DbService, private breakpointService: BreakpointService, private selecting: SelectingService) { }

  ngOnInit(): void {
    this.setInactiveKeys();
    this.subscriptions.push(this.breakpointService.responsive.subscribe(responsive => this.responsive = responsive))
    this.subscriptions.push(this.updateSubject.pipe(
      debounceTime(750),
      map(async ({ val, key }) =>
        await this.updateValue({val, key, debounce: false}))
    ).subscribe());
  }

  setInactiveKeys() {
    this.inactiveKeys = [];
    this.optionKeys.forEach(key => {
      this.block[key] = (!!!this.block[key]?.length && key !== 'image') ? null : this.block[key];
      if (this.block[key] === null) this.inactiveKeys.push(key);
      return this.block[key]
    });
  }

  getClassValue(optionKey, classNames) {
    return this.parseClasses.getValueFromClassNames(optionKey, classNames)
  }

  addOption(key) {
    if (this.inactiveKeys.includes(key))
      this.inactiveKeys = this.inactiveKeys.filter(k => k !== key);
    if (this.textInputKeys.includes(key))
      return this.block[key] = '';
    if (key === 'image')
      return this.initImage = true;
  }
  
  async updateClassValue(val, optionKey, blockKey) {
    if (!!!this.block?.classes) this.block.classes = {};
    this.block.classes[blockKey] = this.parseClasses.setClassNamesFromInputValue(val, optionKey, this.block.classes[blockKey], this.responsive);
    this.textInputKeys
    this.updated.emit(this.block);

  }

  async updateValue(data: {val:any, key:string, debounce:boolean}) {
    const {val, key, debounce = false} = data
    if (!!debounce && !!val?.length)
      return this.updateSubject.next(({ val, key }));
    this.block[key] = val;
    try {
      this.block[key] = val;
      this.inactiveKeys = [];
      this.optionKeys.forEach(key => !!!this.block[key]?.length ? this.inactiveKeys.push(key) : '');
      return this.updated.emit(this.block)
    } catch (errs) {
      console.error(errs.message)
    }
  }

  selectContent(event) {
    const _this = this;
    this.selecting.selectEntity({ elem: event.srcElement, multiple: false }, (selected) => {
      if (!!!selected) return;
      if (!!selected.image || !!selected.images?.length)
        _this.block.image = !!selected.image ? selected.image : selected.images[0]
      if(!!selected?.title) _this.block.title = selected.title;
      if(!!selected?.name && !!!selected?.title) _this.block.title = selected.name;
      if (selected.type = 'project') {
        if (!!selected.sector) _this.block.text = selected.sector;
        if (!!selected.location)
          _this.block.linkText = `${!!selected.location.city ? selected.location.city : ''}${!!selected.location.state && !!selected.location.city ? ', ' : '' }${!!selected.location.state ? selected.location.state : ''}`;
      } else {
        if (!!selected?.description?.length)
          _this.block.text = selected.description.length > 25 ? selected.description.substr(0, 25) : selected.description;
        if (!!selected?.excerpt?.length && !!!selected.description?.length)
          _this.block.text = selected.excerpt.length > 25 ? selected.excerpt.substr(0, 25) : selected.excerpt;
        if (!!selected.jobTitle && !!!selected?.excerpt?.length && !!!selected.description?.length)
          _this.block.text = selected.jobTitle;
      }
      if (selected.type !== 'team')
        _this.block.link = `/${selected.type === 'page' ? '' : `${COLLECTION_TYPE_FROM_SINGULAR[selected.type]}/`}${selected.handle}`;
      this.setInactiveKeys();
      return _this.updated.emit(_this.block)
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe : '')
  }

}






/*
---------------------------------------
COMPONENT: DIALOG
---------------------------------------
*/
interface DataParams { block: ContentBlock, updateCallback: Function };

@Component({
  selector: 'app-edit-card-dialog',
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardDialogComponent implements OnInit {

  

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: DataParams,
  ) { }

  ngOnInit(): void { }

  updateCallback(val) {
    if (!!!this.data?.updateCallback || !!!val) return;
    return this.data.updateCallback(val)
  }

}