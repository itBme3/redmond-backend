import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChildren } from '@angular/core';
import * as funcs from 'projects/redmond-fire-library/src/lib/services/funcs';
import { BlockInputType, BlockOptionKey, BlockOption_CustomInputType, ContentBlock, CustomInputType, entityOptions } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { EntityStatus, ENTITY_STATUS_LIST, PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';
import {ParseClasses} from 'projects/redmond-fire-library/src/lib/services/parse-class-names';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SelectingService } from '../../../services/selecting.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  inputs: ['data']
})
export class CustomInputComponent implements OnChanges, AfterViewInit, OnDestroy {

  parseClasses = new ParseClasses()
  responsiveOptions = this.parseClasses.RESPONSIVE_STYLES
  @Input() public responsive:ScreenBreakpoint
  @Input() data: {
    optionKey?: BlockOptionKey;
    doc?: ContentBlock | PageDoc,
    inputType?: BlockInputType | BlockOption_CustomInputType;
    value?: any;
    defaultValue?: any;
    options?:
    | { min: number; max: number; value: number; step: number; hideInput?: boolean }
    | string[]
    | { valueField?: string, canCreate?: boolean, createItem?: Function }
    | { value: any; label?: string; icon?: string; classNames?: string }[]
    | { 0: { icon: string, label: string }; 1: { icon: string, label: string }; }
    | { [key: string]: any }
    | any;
    label?: string | null;
    hasSides?: boolean;
    classesKey?: string;
    classNames?: string;
    hideInput?: boolean;
    inputClasses?: string;
    labelClasses?: string;
    optionClasses?: string;
    optionLabelClasses?: string;
    optionsContainerClasses?: string;
    classes?: string;
    optionIconClasses?: string;
    activeOptionClasses?: string;
    hoverOptionClasses?: string;
    showOptionsLabels?: boolean;
    hideLabel?: boolean;
    multiple?: boolean;
    mediaType?: 'image' | 'video' | 'pdf';
    openDialog?: false;
    updateCallback?: Function;
    collection?: string;
  }

  updatedSubject = new Subject()

  classNamespace: string = null
  
  imageIndex: number = null;

  statusColors = entityOptions.status.options.reduce((acc, option) => {
    acc[option.value] = option.color;
    return acc
  }, {});

  customOptions = {
    ...this.parseClasses.STYLE_OPTIONS,
    ...this.parseClasses.CUSTOM_OPTIONS,
    status: {
      options: ENTITY_STATUS_LIST,
      inputType: 'select',
      DEFAULT: EntityStatus.DRAFT
    },
    responsive: {
      options: [
        { icon: 'mobile', value: ScreenBreakpoint.DEFAULT },
        { icon: 'tablet', value: ScreenBreakpoint.SM },
        { icon: 'laptop', value: ScreenBreakpoint.MD },
        { icon: 'desktop', value: ScreenBreakpoint.LG },
      ],
      inputType: 'icons',
      DEFAULT: ScreenBreakpoint.DEFAULT
    },
    ...['title','name', 'excerpt', 'description'].reduce((acc, key) => {
      return { ...acc, [key]: { inputType: 'textarea', DEFAULT: '' } } 
    }, {}),
    ...[ 'jobTitle', 'linkedIn', 'client', 'city', 'state'].reduce((acc, key) => {
      return { ...acc, [key]: { inputType: 'text', DEFAULT: '' } } 
    }, {})
  }

  optionCollectionSelects = ['project_sectors', 'post_categories']


  defaultVals: { [key: string]: any }

  subscriptions: Subscription[] = []
  breakpointSubscription$:Subscription

  val:any = null

  styleOptions = this.parseClasses.STYLE_OPTIONS
  
  @Output() public updated = new EventEmitter()
  @Output() public changed = new EventEmitter() /* used for text inputs on keyup */
  @Output() public updateResponsive = new EventEmitter<ScreenBreakpoint>()

  @ViewChildren('textareaAutoresize') textareaAutosize;
  @ViewChildren('textareaElem') textareaElems;

  constructor(private selectingService: SelectingService, private dialogService: DialogService) {
    
    this.subscriptions.push(this.updatedSubject.pipe(debounceTime(500), map(value => {
      this.data.value = value;
      this.updated.emit(value);
    })).subscribe())
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data.inputType === 'iconCheckbox' && !!!this.data.options) {
      const label = !!this?.data?.label ? this.data.label : '';
      this.data.options = { 0: { icon: 'box', label }, 1: { icon: 'checkbox', label } }
    }
    this.getVal(changes.data);
  }

  ngAfterViewInit() {
    if(!!!this.textareaAutosize?.length) return;
    funcs.setTimeout$(() => {
      this.textareaAutosize.forEach(elem =>{
        !!elem?.resizeToFitContent ? elem.resizeToFitContent(true) : ''
      })
    }, 1000);
  }

  getVal(_changes = null) {
    if (!!!this.data) return;
    let _val: any = null;
    if (!!!this.data.classNames?.length && !!this.data?.classesKey && !!this.data?.doc?.classes[this.data.classesKey])
      this.data.classNames = this.data.doc.classes[this.data.classesKey];
    if (!!this.data?.optionKey && !!this.customOptions[this.data.optionKey]) {
      if(!!!this.data.options)
        this.data.options = !!this.data?.options ? this.data.options : this.customOptions[this.data.optionKey].options;
      if(!!!this.data.inputType || !Object.keys(CustomInputType).includes(this.data.inputType))
        this.data.inputType = !!this.customOptions[this.data.optionKey]?.inputType ? this.customOptions[this.data.optionKey].inputType : !!this.data?.inputType ? this.data.inputType : null;
      if(!!!this.classNamespace)
        this.classNamespace = this.customOptions[this.data.optionKey].classNamespace;
      if(!!!this.data.label)
        this.data.label = !!this.data?.label?.length ? this.data.label : this.customOptions[this.data.optionKey].label;
    }
    if (!!this.data?.optionKey && !!this.data?.doc && typeof this.data?.optionKey === 'string' && !!this.data.doc.hasOwnProperty(this.data.optionKey)) {
      _val = this.data.doc[this.data.optionKey];
    } else if (!!this.classNamespace && Object.keys(this.styleOptions).includes(this.data.optionKey)) {
      _val = this.parseClasses.getValueFromClassNames(this.data.optionKey, this.data.classNames, this.responsive)
      if(!!!_val) _val = this.parseClasses.getValueFromClassNames(this.classNamespace, this.data.classNames, this.responsive)
    } else if (!!this.data?.doc?.classes && this.data?.doc?.classes[this.data?.optionKey] !== undefined) {
      _val = this.data.doc.classes[this.data.optionKey];
    } else {
      _val = this.data.value !== undefined ? this.data.value : !!this.data?.doc && this.data.doc.hasOwnProperty(this.data.optionKey) ? this.data.doc[this.data.optionKey] : this.customOptions[this.data.optionKey]?.DEFAULT !== undefined ? this.customOptions[this.data.optionKey].DEFAULT : null;
    }
    if (this.data.inputType === 'slider' && !!this.customOptions[this.data?.optionKey]?.options.includes(_val))
      _val = this.parseClasses.getInputValueFromClassNames(this.data.optionKey, this.data.classNames, this.responsive)
  
    if(this.data.value !== _val)
      this.data.value = _val;
    if(this.val !== _val)
      this.val = _val;
    return this.val
  }

  setVal(updateVal) {
    
    if (this.data.inputType === 'slider' && !!this.customOptions[this.data?.optionKey]?.options[updateVal]) {
      this.data.value = this.customOptions[this.data.optionKey].options[updateVal]
    } else if (!!updateVal.key) {
      this.data.value = !!!this.data.value ? { [updateVal.key]: updateVal.value } : {...this.data.value, [updateVal.key]: updateVal.value};
    } else {
      this.data.value = updateVal
    }
    this.val = this.data.value
    // this.updated.emit(`${ this.parseClasses.RESPONSIVE_STYLES.includes(this.data.optionKey) && !!this.responsive && this.responsive !== ScreenBreakpoint.DEFAULT ? `${this.responsive}:` : ''}${this.data.value}`);
    if (!!!this.data?.classNames?.length && !!this.data?.classesKey && !!this.data?.doc?.classes[this.data.classesKey])
      this.data.classNames = this.data.doc[this.data.classesKey];
    if (!!this.data?.classNames?.length) {
      const newClasses = this.parseClasses.setClassValue(this.classNamespace, this.val, this.data.classNames, this.responsive)
      this.data.classNames = newClasses;
      if (!!!this.data.classNames?.length && !!this.data?.classesKey && !!this.data?.doc[this.data.classesKey])
        this.data.doc.classes[this.data.classesKey] = this.data.classNames;
      // this.data.classNames = this.parseClasses.setClassValue(this.classNamespace, this.data.value, this.data.classNames, this.responsive)
    }
    this.updated.emit(this.data.value);
    this.getVal();
  }

  get ariaLabel() {
    return this.data.label ? funcs.handleize(this.data.label) : 'custom-input'
  }

  get options() {
    if (!!!this.data?.options) return [];
    if (typeof this.data.options === 'string')
      return !!this.customOptions[this.data?.optionKey] ? this.customOptions[this.data.optionKey].options : [];
    return this.data.options
  }

  get optionClasses():string[] {
    let optionClasses: string[] = !!this.data.optionClasses ? this.data.optionClasses.split(' ') : [];
    const oppositeShade = (shade: 'light' | 'dark') => shade === 'dark' ? 'lighten' : 'darken';
    const containerColorClasses:string[] = !!!this.data?.optionsContainerClasses?.split ? [] : this.data.optionsContainerClasses.split(' ').filter(c => c.indexOf('bg-') === 0 || c.indexOf('text-') === 0);
    const defaultColorClasses = [];
    containerColorClasses.forEach(c => {
      if (c.includes('bg-'))
        defaultColorClasses.push(`text-${oppositeShade(c.includes('dark') ? 'dark' : 'light')}en-07`);
    });
    if (defaultColorClasses.length === 0)
      defaultColorClasses.push('text-darken-07');
    defaultColorClasses.forEach(colorClassName => {
      if (optionClasses.filter(c => c.indexOf(`${colorClassName.split('-')[0]}-`)).length === 0)
        optionClasses.push(colorClassName)
    })
    return optionClasses
  }

  get activeOptionClasses():string[] {
    let optionClasses = this.optionClasses.filter(c => c.indexOf('bg-') !== 0 && c.indexOf('text-') !== 0);
    const activeClasses = !!this.data.activeOptionClasses ? this.data.activeOptionClasses.split(' ') : [];
    return [...optionClasses, ...activeClasses]
  }

  
  get checkboxIcon(): string {
    if (typeof this.data.options === 'string')
      return null;
    return !!this.data?.options[!!!this.val ? 0 : 1] && !!this.data.options[!!!this.val ? 0 : 1].icon ?
      this.data.options[!!!this.val ? 0 : 1].icon
      : !!!this.val ? 'box' : 'box-checked'
  }


  colorCallback(event) {
    this.setVal(event)
  }

  customInputData(changes: { [key: string]: any }) {
    const res = JSON.parse(JSON.stringify(this.data))
    Object.keys(changes).forEach(key => res[key] = changes[key]);
    return changes
  }

  selectImage(event) {
    const _this = this;
    if (event.srcElement.classList.contains('remove-image')) return;
    this.selectingService.selectMedia({
      dialogParams: {
        maxWidth: 'calc(100vw - 2em)', 
        width: 'calc(100vw - 2em)', 
        height: 'calc(100vh - 2em)',
        position: { top: '1em', left: '1em' }
      },
      componentParams: {
        multiple: this.data.inputType === 'images',
        selected: this.data.inputType === 'images' && Array.isArray(this.data.value) ? this.data.value : []
      }
    }, (selection) => {
      let res: any = Array.isArray(selection) ? selection.map(d => funcs.tinyDoc(d)) : funcs.tinyDoc(selection)
      if (!!_this.data.updateCallback) _this.data.updateCallback(res);
      _this.updated.emit(res);
    })
    
    
  }

  removeImage(event, imgIndex: number | null) {
    const _this = this;
    this.dialogService.confirmButton({ elem: event.srcElement }, () => {
      if (typeof imgIndex !== 'number') return _this.updated.emit(null);
      _this.val.splice(imgIndex, 1);
      _this.updated.emit(this.val)
    })
  }

  toggleResponsive(val) {
    this.responsive = val;
    this.updateResponsive.emit(val);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}


