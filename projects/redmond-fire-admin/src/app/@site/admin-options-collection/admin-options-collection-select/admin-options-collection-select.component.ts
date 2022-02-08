import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminCollectionService } from 'projects/redmond-fire-library/src/lib/services/admin-collections.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-options-collection-select',
  templateUrl: './admin-options-collection-select.component.html',
  styleUrls: ['./admin-options-collection-select.component.scss']
})
export class AdminOptionsCollectionSelectComponent implements OnInit {

  @Input() optionCollection: 'project_sectors' | 'post_categories'
  @Input() value: any = null
  @Input() customInputParams: {[key:string]: any} = {}
  @Output() updated = new EventEmitter()
  data: {[key:string]: any} = {}

  options: { label: string; value: any }[]

  constructor(private collectionService: AdminCollectionService) { }

  ngOnInit(): void {
    this.collectionService.optionsCollections[this.optionCollection].pipe(take(1))
      .toPromise().then((doc) => {
        this.options = doc.map(itm => {
          return { label: itm.label, value: itm.handle }
        });
        this.data = { ...this.customInputParams, optionKey: null, inputType: 'select', options: this.options, value: this.value }
      })
  }

}
