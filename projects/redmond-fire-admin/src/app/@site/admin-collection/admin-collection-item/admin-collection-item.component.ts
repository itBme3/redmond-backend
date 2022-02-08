import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs'
import { COLLECTION_TYPES, OPTIONS_COLLECTION_TYPES } from 'projects/redmond-fire-library/src/lib/models/collections';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';
import { COLLECTION_TYPE_FROM_SINGULAR } from 'projects/redmond-fire-library/src/lib/models/collections';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SiteContentService } from '../../../services/site-content.service';
@Component({
  selector: 'app-admin-collection-item',
  templateUrl: './admin-collection-item.component.html',
  styleUrls: ['./admin-collection-item.component.scss']
})
export class AdminCollectionItemComponent implements OnInit, AfterViewInit {

  @Input() doc;
  @Input() isSelected: boolean = false;
  @Output() public selectItem = new EventEmitter();
  @Output() selectedItems: PageDoc[];
  mediaFields = ['src', 'image'];
  media: any[] = [];
  pageUrl: string;
  funcs = FUNCS;
  collectionTypeFromEntityType = COLLECTION_TYPE_FROM_SINGULAR

  constructor(private snackBar: MatSnackBar, public router: Router, public route: ActivatedRoute, private clipboard: Clipboard, private siteContent: SiteContentService) {
  }

  copyImageUrl() {
    let imageUrl = !!this.doc?.image ?
      !!this.doc?.image?.thumbs && !!this.doc?.image?.thumbs['1500'] ?
        this.doc?.image?.thumbs['1500'] :
        this.doc.image.src :
      !!this.doc?.images?.length ?
        !!this.doc.images[0]?.thumbs && !!this.doc.images[0]?.thumbs['1500'] ?
          this.doc.images[0].thumbs['1500'] :
          this.doc.images[0].src :
        !!this.doc?.thumbs && !!this.doc?.thumbs['1500'] ?
          this.doc.thumbs['1500'] :
        this.doc.src ? this.doc.src :
            null;
    if (!!!imageUrl) return;
    this.clipboard.copy(imageUrl);
    this.snackBar.open('Url copied 👍', null, {
      duration: 1000,
      verticalPosition: 'top',
      panelClass: ['shadow-md', 'bg-gray-800']
    });
  }

  ngOnInit() {
    const pathSegments = this.doc.docPath.split('/');
    this.pageUrl = OPTIONS_COLLECTION_TYPES.includes(pathSegments[0]) || COLLECTION_TYPES.includes(pathSegments[0]) ? `${pathSegments[1]}/${this.doc.docId}` : null
    this.media = !!this.doc.src ? this.doc : !!this.doc.image ? this.doc.image.src : !!this.doc.url ? this.doc.url : [];
  }

  ngAfterViewInit() {
    return this.siteContent.getMissingImageThumbs(this.doc).catch(console.error);
  }

}
