import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminSiteEntityFormDialogComponent } from '../@site/admin-site-entity-form/admin-site-entity-form-dialog/admin-site-entity-form-dialog.component';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { getDefaultDoc, PageDoc, PAGE_KEYS_BY_TYPE, SiteEntityType } from 'projects/redmond-fire-library/src/lib/models/docs'
import { CollectionDoc, CollectionType, COLLECTION_TYPE_FROM_SINGULAR } from 'projects/redmond-fire-library/src/lib/models/collections';
import { UploaderDialogComponent } from '../@shared/ui/uploader/uploader.component';
import { check_ObjectsAreTheSame } from 'projects/redmond-fire-library/src/lib/services/funcs';

export interface SingleEntityCollectionBlockQueryObject {
      tags: { include: string[], exclude: string[] }[],
      collection: CollectionType,
      limit: number,
      sort: [string, 'asc' | 'desc'],
      microsite?: string;
}
export enum SingleEntitySidenavSectionType {
      PAGE_INFO = 'Page Info',
      BLOCKS = 'Blocks',
      REDIRECTS = 'Redirects',
}
export interface EditingEntityContentInterface {
      editing: SingleEntitySidenavSectionType;
      key?: string; blockIndex?: number; contentDocPath?: string;
}

@Injectable({
      providedIn: 'root'
})

export class SiteContentService {

      funcs = FUNCS;

      _editingEntityContent: EditingEntityContentInterface = {
            editing: null, blockIndex: null, key: null, contentDocPath: null
      }
      private EditingEntityContent = new BehaviorSubject<EditingEntityContentInterface>(this._editingEntityContent);
      editingEntityContent = this.EditingEntityContent.asObservable();

      allOrderedProjects$:Observable<PageDoc[]>

      constructor(private dialog: MatDialog, private db: DbService, private router: Router, private uiService: UiService) {
            this.allOrderedProjects$ = this.db.collection$('admin/projects/collection', ref => ref.orderBy('order', 'asc').where('status', 'in', ['published', 'draft']), true);
      }

      changeEditingEntityContent(data: {
            editing?: SingleEntitySidenavSectionType,
            blockIndex?: number;
            key?: string;
            merge?: boolean
      }) {
            const currentEditingEntityContent = JSON.parse(JSON.stringify(this._editingEntityContent));
            const { merge = true } = data;
            if (!!merge) {
                  Object.keys(data).filter(k => !['merge'].includes(k))
                        .forEach(key => this._editingEntityContent[key] = data[key])
            } else {
                  const { blockIndex = null, key = null } = data;
                  const editing: SingleEntitySidenavSectionType = typeof blockIndex === 'number' ? SingleEntitySidenavSectionType.BLOCKS : !!data.editing ? data.editing : null;
                  this._editingEntityContent = { blockIndex, key, editing }
            }
            if (this.funcs.check_ObjectsAreTheSame(currentEditingEntityContent, JSON.parse(JSON.stringify(this._editingEntityContent))))
                  return;
            this.EditingEntityContent.next({ ...this._editingEntityContent })
      }

      dialogEntityForm(
            params: {
                  elem?: any;
                  componentParams: {
                        doc: PageDoc | CollectionDoc,
                        keys: string[],
                        creating?: boolean;
                        shouldSave?: boolean;
                  };
                  classes?: { [key: string]: string };
                  dialogParams?: { [key: string]: any };
                  updateCallback?: Function;
            },
            callback?: Function
      ) {
            const { elem = null, updateCallback = null, componentParams = null, dialogParams = { maxWidth: '300px', maxHeight: '300px' } } = params;
            if (!!!componentParams) return console.error(`componentParams no provided`);
            const dialogData: { [key: string]: any } = {
                  ...dialogParams,
                  panelClass: 'admin-site-entity-form-dialog',
                  backdropClass: 'bg-transparent',
                  data: { ...componentParams, updateCallback }
            };
            if (!!elem && !!!dialogData?.position) dialogData.position = FUNCS.dialogPositioning(elem, !!dialogParams.maxWidth ? dialogParams.maxWidth : null);
            const dialogRef = this.dialog.open(AdminSiteEntityFormDialogComponent, dialogData);
            
            dialogRef.afterClosed().pipe(take(1)).subscribe((res) => {
                  if (!!!callback) return;
                  return callback(res);
            });
      }

      async dialogCreateSiteEntity(elem, entityType: SiteEntityType, collectionPath: string, docData?: { [key: string]: any }) {
            const defaultDoc = getDefaultDoc(entityType);
            if (!!!defaultDoc) return console.error(`no defaultDoc for ${entityType}`)
            const doc = await this.db.updateAt(collectionPath, { ...defaultDoc, ...docData });
            const _this = this;
            this.dialogEntityForm({
                  elem,
                  componentParams: {
                        doc,
                        creating: true,
                        keys: PAGE_KEYS_BY_TYPE[entityType].filter(key => !['blocks', 'status', 'carousel', 'content', 'post_category', 'project_sector'].includes(key))
                  },
                  dialogParams: { maxWidth: '420px', width: 'calc(100vw - 2em)', maxHeight: '90vh', hasBackdrop: false, closeOnNavigation: true }
            }, async (update) => {
                        if (!!!update) return _this.db.delete(doc.docPath)
                              .catch(err => console.error(err.message));
                        await _this.updateDoc(update)
                              .catch(console.error);
                        if (!!!update?.docId) return;
                        return _this.router.navigate([`/site/${COLLECTION_TYPE_FROM_SINGULAR[update.type]}`, `${update.docId}`])
                              .catch(err => console.error(err.message))
            })
      }

      async dialogUploadFiles(params: { elem: any, dialogParams?: {[key:string]:any}, componentParams?: {[key:string]:any}}, callback: Function = null) {
            const { elem = null, dialogParams = { maxWidth: '420px', width: '90vw' }, componentParams = {} } = params;
            const dialogData: { [key: string]: any } = {
                  ...dialogParams,
                  panelClass: 'admin-site-entity-form-dialog',
                  backdropClass: 'bg-transparent',
                  data: { ...componentParams }
            };
            if (!!elem && !!!dialogData?.position) dialogData.position = FUNCS.dialogPositioning(elem, !!dialogParams.maxWidth ? dialogParams.maxWidth : null);
            const dialogRef = this.dialog.open(UploaderDialogComponent, dialogData);
            dialogRef.afterClosed().pipe(take(1)).subscribe((res) => {
                  if (!!!callback) return;
                  return callback(res);
            });
      }

      updateDoc(doc: PageDoc | { docPath: string;[key: string]: any } | any, publishImmediately: boolean = false) {
            if (!!!doc?.docPath) return;
            if (publishImmediately) {
                  if (!!!doc.publishedAt) doc.publishedAt = Date.now();
                  doc.updatedAt = Date.now();
                  doc.savedAt = Date.now();
                  doc.status = 'published';
            } else if (doc.status === 'published') {
                  doc.status = 'unsaved'
            }
            this.uiService.triggerSizeReset()
            return this.db.updateAt(doc.docPath, { ...doc })
                  .catch(err => { throw new Error(err.message) })
      }

      async getMissingImageThumbs(doc) {
            if (!!doc.fileType) return;
            const getThumbs = async (image) => {
                  if (!!image?.thumbs || !!!image?.docId || !!!image?.src) return null;
                  const imageDoc = await this.db.doc$(`uploads/${image.docId}`).pipe(take(1)).toPromise();
                  console.log({ imageDoc })
                  return !!imageDoc.thumbs ? imageDoc.thumbs : null
            }
            let shouldUpdate = false;
            if (!!doc?.image?.src && !!!doc?.image?.thumbs) {
                  doc.image.thumbs = await getThumbs(doc.image);
                  if (!!doc?.image?.thumbs) shouldUpdate = true;
            }
            if (!!doc?.images?.length && !!doc.images.filter(image => !!image?.src && !!image?.docId && !!!doc?.thumbs)?.length)
                  doc.images = await (async () => {
                        const images = [];
                        for (let i = 0; i < doc.images.length; i++) {
                              if (!!doc.images[i]?.thumbs || !!!doc.images[i]?.src || !!!doc.images[i]?.docId) {
                                    images.push(doc.images[i])
                              } else {
                                    const thumbs = await getThumbs(doc.images[i]);
                                    if (!!thumbs) shouldUpdate = true;
                                    images.push({ ...doc.images[i], thumbs });
                              }
                              if (i === doc.images.length - 1) return images;
                        }
                  })();
            if (!!doc?.blocks?.length) {
                  doc.blocks = await Promise.all(doc.blocks.map(async block => {
                        if (!!block?.image?.docId) {
                              if (!!block?.image?.thumbs)
                                    return block;
                              block.image.thumbs = await getThumbs(block.image);
                              return block;
                        }
                        if (!!block?.slides?.length && block?.slides.filter(s => !!s?.image?.src && !!!s?.image?.thumbs)?.length) {
                              console.log( {slides: block.slides} )
                              block.slides = await (async () => {
                                    const slides = [];
                                    for (let i = 0; i < block.slides.length; i++) {
                                          if (!!!block.slides[i]?.image?.src || !!block.slides[i]?.image?.thumbs || !!!block.slides[i]?.image?.docId) {
                                                slides.push(block.slides[i]);
                                          } else {
                                                block.slides[i].image.thumbs = await getThumbs(block.slides[i].image).catch(console.error);
                                                if (!!block.slides[i].image.thumbs) shouldUpdate = true;
                                                slides.push(block.slides[i]);
                                          }
                                          if(i === block.slides.length - 1)
                                                return slides
                                    }
                              })();
                        }
                        if (!!block?.items?.length && block?.items.filter(s => !!s?.image?.src && !!!s?.image?.thumbs)?.length) {
                              console.log( {items: block.items} )
                              block.items = await (async () => {
                                    const items = [];
                                    for (let i = 0; i < block.items.length; i++) {
                                          if (!!!block.items[i]?.image?.src || !!block.items[i]?.image?.thumbs || !!!block.items[i]?.image?.docId) {
                                                items.push(block.items[i]);
                                          } else {
                                                block.items[i].image.thumbs = await getThumbs(block.items[i].image).catch(console.error);
                                                if (!!block.items[i].image.thumbs) shouldUpdate = true;
                                                items.push(block.items[i]);
                                          }
                                          if(i === block.items.length - 1)
                                                return items
                                    }
                              })();
                        }
                        return block
                  })).catch(errs => { throw new Error(errs.message) });
            }
            if (!!!shouldUpdate) return;
            return this.db.updateAt(doc.docPath, { ...doc }).catch(err => { throw new Error(err.message) });
      }

}



export const defaultEntityDoc = (params: { entityType: SiteEntityType, docData: { [key: string]: any } }) => {
      const { entityType = null, docData = {} } = params;
      if (!!!entityType) return;
      const defaultDoc = getDefaultDoc(entityType);
      if (!!!defaultDoc) return null;
      return { ...defaultDoc, ...docData }
}