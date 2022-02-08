import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { COLLECTION_TYPES, COLLECTION_TYPE_FROM_SINGULAR, SITE_COLLECTION_TYPES} from 'projects/redmond-fire-library/src/lib/models/collections';
import{DbService } from 'projects/redmond-fire-library/src/lib/services/db.service'
import { take } from 'rxjs/operators';
import { SelectingService } from '../../../services/selecting.service';

@Component({
  selector: 'app-admin-input-link',
  templateUrl: './admin-input-link.component.html',
  styleUrls: ['./admin-input-link.component.scss']
})
export class AdminInputLinkComponent implements OnInit {

  @Input() link:string = null
  
  linkStatus: 'found' | 'external' | 'missing' = null;

  linkStatusColors = { found: 'green', missing: 'red', external: 'blue'}

  @Output() updated = new EventEmitter()

  constructor(private selecting: SelectingService, private db: DbService) { }

  ngOnInit(): void {
  }

  updateLink(val) {
    this.link = val;
    this.setLinkStatus();
    this.updated.emit(val);
  }

  setLinkStatus() {
    if (this.link.includes('.')) return this.linkStatus = 'external';
    const collectionTypes = SITE_COLLECTION_TYPES.map(t => `${t}`).filter(t => t !== 'pages');
    const collection = COLLECTION_TYPES.map(c => `${c}`).includes(this.link.split('/')[1]) ? this.link.split('/')[1] : 'pages';
    const handle = this.link === '/' ? '/' : this.link.split('/')[collection === 'pages' ? 1 : 2];
    if (!!!handle && collectionTypes)
      return this.linkStatus = 'found';
    return this.db.collection$(collectionTypes.includes(collection) ? `public` : `public/${collection}/collection`, ref => ref.where('handle', '==', handle))
      .pipe(take(1)).toPromise().then(res => 
        this.linkStatus = !!res?.length ? 'found' : 'missing'
      )
  }

  selectEntity(event) {
    this.selecting.selectEntity({ elem:event.srcElement, multiple: false }, (selection) => {
      if (!!!selection?.handle) return;
      return this.updateLink(`${selection.handle === '/' ? '' : '/'}${selection.type === 'page' ? '' : `${COLLECTION_TYPE_FROM_SINGULAR[selection.type]}/`}${selection.handle}`);
    })
  }

}
