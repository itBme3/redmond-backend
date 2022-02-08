import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {BlockType, BLOCK_TYPES, BlockInputType, ContentBlock, CustomInputType} from 'projects/redmond-fire-library/src/lib/models/entity-options';
import {BreakpointService } from 'projects/redmond-fire-library/src/lib/services/breakpoint.service';
import {ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';
import {PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import {ParseClasses} from 'projects/redmond-fire-library/src/lib/services/parse-class-names';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';
import { EditBlockOptionParams } from 'projects/redmond-fire-admin/src/app/services/site-block.service';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { SiteContentService } from 'projects/redmond-fire-admin/src/app/services/site-content.service';



@Component({
  selector: 'app-edit-block-option-dialog',
  templateUrl: './edit-block-option-dialog.component.html',
  styleUrls: ['./edit-block-option-dialog.component.scss']
})
export class EditBlockOptionDialogComponent implements OnInit {
  blockTypes:string[] = BLOCK_TYPES.map(t => `${t}`)
  updateCallback: Function = () => console.log('no "updateCallback" param provided')
  optionKey: CustomInputType | BlockType | string = null
  block: ContentBlock = null
  inputType: BlockInputType | string = null
  classesKey: string = ''
  parseClasses = new ParseClasses()
  classNamespace: string = null
  subscriptions: Subscription[] = []
  responsive: ScreenBreakpoint = ScreenBreakpoint.DEFAULT
  isResponsiveStyle: boolean
  swiper: Swiper = null
  blockIndex: number | null
  doc: PageDoc
  
  constructor(
    private uiService: UiService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: EditBlockOptionParams,
    private breakpointService: BreakpointService,
    private siteContent: SiteContentService
  ) {
    const { doc = null, blockIndex = null, updateCallback = this.updateCallback, inputType = this.inputType, optionKey = this.optionKey, block = this.block, classesKey = this.classesKey, swiper = this.swiper } = this.data;
    this.block = block;
    this.blockIndex = blockIndex;
    this.doc = doc;
    this.optionKey = optionKey;
    this.updateCallback = updateCallback;
    this.inputType = inputType;
    this.classesKey = classesKey;
    this.swiper = swiper;
    this.uiService.setActiveSwiper(swiper);
  }

  ngOnInit(): void {
    this.isResponsiveStyle = this.parseClasses.RESPONSIVE_STYLES.includes(this.optionKey);
    this.subscriptions.push(this.breakpointService.responsive.subscribe(responsive => this.responsive = responsive));
    if (['image'].includes(this.optionKey))
      this.inputType = this.optionKey;
    this.classNamespace = Object.keys(this.parseClasses.STYLE_OPTIONS).includes(this.optionKey) &&
      !!this.parseClasses?.STYLE_OPTIONS[this.optionKey]?.classNamespace ? this.parseClasses.STYLE_OPTIONS[this.optionKey].classNamespace : null;
  }

  updating(val, responsive = null, optionKey = null, classKey = null) {
    const classNamespace = !!this.parseClasses?.STYLE_OPTIONS[optionKey] && this.parseClasses?.STYLE_OPTIONS[optionKey]?.classNamespace ? this.parseClasses.STYLE_OPTIONS[optionKey].classNamespace : null;
    if ((!!!optionKey || !!!classKey) || !!!classNamespace) {
      this.updateCallback(val);
      this.doc.blocks[this.blockIndex] = val;
    } else {
      if (typeof this.blockIndex === 'number') {
        const classNames = !!this.doc?.blocks[this.blockIndex] && !!this.doc?.blocks[this.blockIndex]?.classes[classKey] ? this.doc.blocks[this.blockIndex].classes[classKey] : '';
        this.doc.blocks[this.blockIndex].classes[classKey] = this.parseClasses.setClassValue(classNamespace, val, classNames, responsive)
      } else {
        const classNames = !!this.doc?.classes[classKey] ? this.doc.classes[classKey] : '';
        this.doc.classes[classKey] = this.parseClasses.setClassValue(classNamespace, val, classNames, responsive)
      }
    }
    return this.siteContent.updateDoc(this.doc)
    // let res = this.updateCallback(e, responsive );
    // this.doc.blocks[this.blockIndex] = e;
    // this.siteContent.updateDoc(this.doc)
    // return res;
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }
  
}
