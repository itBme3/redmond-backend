import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteCollectionType } from 'projects/redmond-fire-library/src/lib/models/docs';
import { collectionSearchData, COLLECTION_TYPE_FROM_SINGULAR } from 'projects/redmond-fire-library/src/lib/models/collections';
import { DbQueryObject } from 'projects/redmond-fire-library/src/lib/services/db.service';

@Component({
  selector: 'app-select-collection-type',
  templateUrl: './select-collection-type.component.html',
  styleUrls: ['./select-collection-type.component.scss']
})
export class SelectCollectionTypeComponent implements OnInit {

  collectionTypes: SiteCollectionType[] = Object.values(SiteCollectionType);
  defaultQuery = { orderBy: 'createdAt,desc', limit: 6 };
  searchData: { selected?: any[], query?: DbQueryObject } = {
    selected: [], query: this.defaultQuery
  };
  dialogData: any;

  

  constructor(
    public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) data) {
    this.dialogData = data;
   }

  ngOnInit(): void {
    

  }

  selectDialog(elem, collectionType) {
    this.searchData =  collectionSearchData(COLLECTION_TYPE_FROM_SINGULAR[collectionType]);
    this.searchData = !!this.dialogData?.searchData ?
      !!this.dialogData?.searchData?.query ? {
        ...this.dialogData.searchData, query: {
          ...this.searchData.query,
          ...this.dialogData.searchData.query
        }
      } : {
          ...this.searchData,
          ...this.dialogData.searchData
      } : this.searchData;
    this.dialogData = { elem, ...this.dialogData, searchData: this.searchData }
  }

}
