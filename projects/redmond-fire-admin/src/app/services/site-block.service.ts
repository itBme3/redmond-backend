import { Injectable } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { EditBlockOptionDialogComponent } from '../@shared/ui/admin-grid-blocks/edit-block-option-dialog/edit-block-option-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { SimpleDialogComponent } from '../@shared/ui/simple-dialog/simple-dialog.component';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { BlockInputType, BlockOptionKey, BlockType, ContentBlock } from 'projects/redmond-fire-library/src/lib/models/entity-options';
import { AddGridBlockComponent } from '../@shared/ui/admin-grid-blocks/add-grid-block/add-grid-block.component';
import { EditCardDialogComponent } from '../@shared/ui/admin-grid-blocks/edit-card/edit-card.component';
import Swiper from 'swiper';
import { dialogPositioning } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { SiteContentService } from './site-content.service';
import { WindowRef } from 'projects/redmond-fire-library/src/lib/services/window-ref';

export interface EditBlockOptionParams {
  optionKey: BlockOptionKey | 'card' | 'carousel';
  block: ContentBlock;
  doc?: PageDoc;
  blockIndex?: number;
  inputType?: BlockInputType;
  updateCallback?: Function;
  classNames?: string;
  classesKey?: string;
  swiper?: Swiper;
}

@Injectable({
      providedIn: 'root'
})
export class SiteBlockService {

      newSlide:ContentBlock = null
      
      constructor(private windowRef: WindowRef, private dialog: MatDialog, private siteContent: SiteContentService) { }
      
      editBlockOption(
            params: {
                  optionKey: string;
                  updateCallback: Function;
                  block: ContentBlock | PageDoc;
                  blockIndex: number;
                  doc: PageDoc;
                  elem?: any;
                  inputType?: BlockInputType;
                  classesKey?: string;
                  dialogParams?: { [key: string]: string };
                  swiper?: Swiper;
            },
            callback: Function = null) {
            const {
                  doc, blockIndex = null,
                  block = null,
                  optionKey = null,
                  elem = null,
                  updateCallback = null,
                  classesKey = null,
                  inputType = null,
                  swiper = null,
                  dialogParams = { maxWidth: '300px', maxHeight: optionKey === 'collection' ? 'auto' : '300px' }
            } = params;
            const dialogData: { [key: string]: any } = { ...dialogParams, data: { optionKey, doc, blockIndex, block, swiper, updateCallback, classesKey, inputType } };
            if (!!elem && optionKey !== 'card') dialogData.position = dialogPositioning(elem, !!dialogData.maxWidth ? dialogData.maxWidth : null);
            const dialogRef:any = this.dialog.open(EditBlockOptionDialogComponent, dialogData);
            dialogRef.afterOpened().pipe(take(1)).toPromise().then(() => {
                  const pane = dialogRef._overlayRef._pane;
                  if (!!this.windowRef?.nativeWindow?.innerHeight && this.windowRef?.nativeWindow?.innerHeight < (pane.offsetHeight + pane.offsetTop))
                        return dialogRef.updatePosition();
            })
            dialogRef.afterClosed().pipe(take(1)).toPromise().then((submitted: any) => {
                  if (!!!callback) return;
                  if (!!!submitted) return;
                  return callback(submitted);
            });
      }

      newBlock(params : { doc: PageDoc, blockIndex:number, elem?, dialogParams?: { [key: string]: any } }, callback:Function = null) {
            const { doc = null, blockIndex = 0, elem = null, dialogParams = { maxWidth: '300px', maxHeight: '300px' } } = params;
            if (!!!doc || !!!doc.docPath) return;
            const dialogData: { [key: string]: any } = {
                  ...dialogParams,
                  panelClass: 'add-block-dialog',
                  backdropClass: 'bg-transparent',
                  autoFocus: false,
            };
            if (!!elem) dialogData.position = dialogPositioning(elem, !!dialogData.maxWidth ? dialogData.maxWidth : null);
            const dialogRef = this.dialog.open(AddGridBlockComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).subscribe((newBlock: any) => {
                  if (!!!newBlock) return;
                  doc.blocks.splice(blockIndex, 0, newBlock);
                  return this.siteContent.updateDoc(doc)
                        .then(() => !!callback ? callback(doc) : '');
            });
      }

      deleteBlock(params: { doc:PageDoc, blockIndex:number, elem?, dialogParams?: { [key: string]: any } }) {
            const { doc = null, blockIndex = null, elem = null, dialogParams = { maxWidth: '300px', maxHeight: '300px' } } = params;
            if (!!!doc || !!!doc?.blocks[blockIndex] || !!!doc.docPath) return;
            const dialogData: { [key: string]: any } = {
                  ...dialogParams, panelClass: 'only-button', backdropClass: 'bg-transparent', autoFocus: false,
                  data: {
                        button: 'confirm',
                        classes: { button: 'bg-red-500 text-white hover:bg-red-600 text-sm text-uppercase' },
                        onlyButton: true
                  }
            };
            if (!!elem) dialogData.position = dialogPositioning(elem, !!dialogData.maxWidth ? dialogData.maxWidth : null);
            const dialogRef = this.dialog.open(SimpleDialogComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: any) => {
                  if (!!!shouldDelete) return;
                  doc.blocks.splice(blockIndex, 1);
                  return this.siteContent.updateDoc(doc);
            });
      }

      editCard(params : { block:ContentBlock, elem?, dialogParams?: { [key: string]: any }, closeCallback: Function }, callback:Function = null) {
            const { block = null, elem = null, dialogParams = { maxWidth: '300px', maxHeight: '300px' }, closeCallback = null } = params;
            if (!!!block) return;
            const dialogData: { [key: string]: any } = {
                  panelClass: ['edit-block-card-dialog', 'bg-green'],
                  backdropClass: 'bg-transparent',
                  autoFocus: false,
                  data: { block, updateCallback: callback },
                  maxWidth: '690px',
                  width: 'calc(100vw - 2em)',
                  height: 'calc(100vh - 100px)',
                  closeOnNavigation: true,
                  ...dialogParams,
            };
            // if (!!elem) dialogData.position = dialogPositioning(elem, !!dialogData.maxWidth ? dialogData.maxWidth : null);
            const dialogRef = this.dialog.open(EditCardDialogComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).subscribe((update: any) => {
                  if (!!!closeCallback) return;
                  return closeCallback(update)
            });
      }
     
      newCarouselSlide(params: { doc: PageDoc, slideIndex: number, blockIndex?: number, elem?, start?: boolean, dialogParams?: { [key: string]: any } }, callback: Function = null) {
            const { doc = null, slideIndex = 0, blockIndex = null, elem = null, dialogParams = { maxWidth: '300px', maxHeight: '300px' } } = params;
            if (!!!doc || !!!doc?.blocks[blockIndex] || !!!doc.docPath) return;
            const dialogData: { [key: string]: any } = {
                  ...dialogParams,
                  panelClass: 'new-carousel-slide-dialog',
                  backdropClass: 'bg-transparent',
                  autoFocus: true,
            };
            const _this = this;
            class AddingSlide {
                  doc: PageDoc
                  slideIndex: number
                  blockIndex: number = null
                  isHero: boolean

                  constructor(doc, slideIndex, blockIndex ) {
                        this.doc = doc;
                        this.slideIndex = slideIndex;
                        this.blockIndex = blockIndex;
                        this.isHero = typeof blockIndex === 'number';
                         _this.newSlide = null
                  }

                  updateCallback(card) {
                        if (!!!card) return;
                        _this.newSlide = card;
                  }
                  closeCallback(newSlide) {
                        if (!!!this.doc?.docPath) return;
                        let slides = typeof this.blockIndex === 'number' && !!this?.doc?.blocks[this.blockIndex]?.slides?.length ?
                              this.doc.blocks[this.blockIndex].slides :
                              this.doc.carousel?.slides?.length ?
                              this.doc.carousel.slides
                              : [];
                        slides.splice(this.blockIndex, 0, newSlide);
                        if (!!this?.doc?.blocks[this.blockIndex]) {
                              this.doc.blocks[this.blockIndex].slides = slides;
                        } else if (!!this.doc?.carousel) {
                              this.doc.carousel.slides = slides
                        }
                        return _this.siteContent.updateDoc(this.doc)
                              .then(() => _this.newSlide = null)
                              .catch(console.error)
                  }
            }
            const addingSlide = new AddingSlide(doc, slideIndex, blockIndex)
            this.editCard({
                  block: { title: '...', link: null, blockType: BlockType.CARD, linkText: null, text: null, image: null, classes: { title: 'text-2xl sm:text-3xl md:5xl lg:6xl', text: 'text-lg sm:text-xl lg:text-2xl' } },
                  elem, dialogParams: dialogData,
                  closeCallback() {
                        addingSlide.closeCallback(_this.newSlide);
                        if (!!!callback) return
                        return callback()
                  }
            }, addingSlide.updateCallback)
            
      }

}

