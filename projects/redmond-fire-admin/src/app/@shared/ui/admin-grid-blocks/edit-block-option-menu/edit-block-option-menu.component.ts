import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SiteBlockService } from 'projects/redmond-fire-admin/src/app/services/site-block.service';
import { SiteContentService } from 'projects/redmond-fire-admin/src/app/services/site-content.service';
import {ParseClasses} from 'projects/redmond-fire-library/src/lib/services/parse-class-names';
import {  ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';
import { BlockOption_CustomInputType, BlockType, ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-edit-block-option-menu',
  templateUrl: './edit-block-option-menu.component.html',
  styleUrls: ['./edit-block-option-menu.component.scss']
})
export class EditBlockOptionMenuComponent implements OnChanges {

  @Output() editKey = new EventEmitter<string>();
  @Input() doc: PageDoc;
  @Input() blockIndex: number = null;
  @Input() blockType: BlockType;
  @Input() optionMenuOpened: boolean = false;
  @Input() responsive: ScreenBreakpoint;
  @Input() swiper: Swiper = null;
  menuItems
  parseClasses = new ParseClasses()

  @ViewChild('menu') optionsMenu;

  constructor(private blockService: SiteBlockService, private db:DbService, private siteContent: SiteContentService) { }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (!!simpleChanges?.blockMenuOpened?.previousValue &&
      !!!simpleChanges?.blockMenuOpened?.currentValue && 
      !!this.optionsMenu.menuOpened) {
      this.optionsMenu.close();
    }
    if (!!!simpleChanges?.blockMenuOpened?.previousValue &&
      !!simpleChanges?.blockMenuOpened?.currentValue && 
      !!!this.optionsMenu.menuOpened) {
      this.optionsMenu.open();
    }
    this.getMenuItems();
  }

  get block():ContentBlock {
    return !!this.doc?.blocks && !!this.doc?.blocks[this.blockIndex] ? this.doc.blocks[this.blockIndex] : null
  }

  getMenuItems() {
    const blockType = !!this.blockType ? this.blockType : !!this.block?.blockType ? this.block?.blockType : null
    const items: { icon: string, label: string, key: string }[] = [];
    
    if (blockType === BlockType.CARD) {
      items.push({ key: 'card', label: 'Card Content', icon: 'card' });
    }
    if (blockType === BlockType.CAROUSEL) {
      items.push({ key: 'carousel', label: 'Carousel Content', icon: 'carousel' });
    }
    if (['card', 'carousel'].includes(blockType))
      items.push({ key: 'aspectRatio', label: 'Aspect Ratio', icon: 'aspect-ratio' });
    
    if (['collection'].includes(blockType)) {
      items.push({ key: 'collection', label: 'Collection Content', icon: 'collection' });
      items.push({ key: 'columns', label: 'Columns', icon: 'columns' });
      items.push({ key: 'spacing', label: 'Spacing', icon: 'grid' })
    }
    
    if (!!blockType) {
      items.push({ key: 'width', label: 'Width', icon: 'width' });
    } else {
      items.push({ key: 'maxWidth', label: 'Width', icon: 'width' });
    }
    items.push({ key: 'padding', label: 'Padding', icon: 'padding' });
    if (!!this.block?.blockType) {
      items.push({ key: 'deleteBlock', label: 'Delete Block', icon: 'trash' });
    } else {
      items.push({ key: 'spacing', label: 'Spacing', icon: 'grid' })
    }
    this.menuItems = items;
    return this.menuItems
  }

  clickedItem(elem, key) {
    if (['title', 'text', 'linkText'].includes(key)) return this.editKey.emit(key);
    if (key === 'deleteBlock')
      return this.blockService.deleteBlock({ doc: this.doc, blockIndex: this.blockIndex, elem });
    const blockClasses = ['maxWidth', 'padding', 'width'];
    const classesKey = !!!this.block?.blockType ? 'blocks' : blockClasses.includes(key) ? 'block' : key;
    if (!!!this.block?.blockType && !!!this.doc?.classes?.blocks) {
      if (!!!this.doc?.classes) this.doc.classes = {};
      this.doc.classes.blocks = ''
    }
    const _this = this;
    const blockIndex = this.blockIndex;
    this.blockService.editBlockOption({
      doc: this.doc,
      blockIndex: this.blockIndex,
      block: !!!_this.block?.blockType ? _this.doc : _this.block,
      swiper: this.swiper,
      classesKey,
      optionKey: key, elem,
      inputType: Object.values(BlockOption_CustomInputType).includes(key) ? key : null,
      dialogParams: {
        panelClass: 'edit-options-dialog',
        backdropClass: 'bg-transparent',
        maxWidth: ['image', 'carousel', 'card', 'collection'].includes(key) ? '420px' : '260px',
        maxHeight: ['image'].includes(key) ? '420px' : ['card', 'carousel', 'collection'].includes(key) ? '80vh' : '260px',
        // minHeight: ['image'].includes(key) ? '80vw' : '40vh',
        width: '80vw',
      },
      async updateCallback(val, responsive: ScreenBreakpoint = null) {
        return await (async () => {
          const doc: any = _this.doc;
          if (!!!doc || !!!doc?.docPath)
            return console.error(`no docPath found on: ${JSON.stringify(doc)}`);
          /* for single block */
          if (!!doc?.blocks[blockIndex]?.blockType) {
            if (doc.blocks[blockIndex].hasOwnProperty(key) || key === 'card') {
              if (doc.blocks[blockIndex].hasOwnProperty(key)) {
                doc.blocks[blockIndex][key] = val;
              } else {
                doc.blocks[blockIndex] = val;
              }
            }
            if (Object.keys(this.parseClasses.STYLE_OPTIONS).includes(key)) {
              const _key = !!this.parseClasses.STYLE_OPTIONS[key]?.classNamespace ? this.parseClasses.STYLE_OPTIONS[key].classNamespace : key;
              const value = _this.parseClasses.setClassValue(_key, val, _this.block.classes[classesKey], responsive);
              _this.block.classes[classesKey] = value;
              doc.blocks[blockIndex] = _this.block
            }
          } else {
            /* for blocks */
            if (Object.keys(this.parseClasses.STYLE_OPTIONS).includes(key)) {
              if (!!!doc?.blocks[blockIndex]?.blockType && !!!doc?.classes?.blocks) {
                if (!!!doc?.classes) doc.classes = {};
                doc.classes.blocks = ''
              }
              const _key = !!this.parseClasses.STYLE_OPTIONS[key]?.classNamespace ? this.parseClasses.STYLE_OPTIONS[key].classNamespace : key;
              const value = _this.parseClasses.setClassValue(_key, val, doc.classes[classesKey], responsive);
              doc.classes[classesKey] = value;
            }
          }
          _this.doc = doc;
          return await _this.siteContent.updateDoc(doc);
         })(); 
        }
    })
  }

}
