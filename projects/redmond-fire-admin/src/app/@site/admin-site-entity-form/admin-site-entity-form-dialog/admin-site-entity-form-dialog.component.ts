import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';

interface DataParams { doc: PageDoc, keys: string[], creating?: boolean; hideCancel: boolean; classes?: { [key: string]: string }, updateCallback: Function };

@Component({
  selector: 'app-admin-site-entity-form-dialog',
  templateUrl: './admin-site-entity-form-dialog.component.html',
  styleUrls: ['./admin-site-entity-form-dialog.component.scss']
})
export class AdminSiteEntityFormDialogComponent implements OnInit, OnDestroy {

  doc: PageDoc;
  keys: string[];
  classes: {[key:string]: string};
  updateCallback: Function;
  creating: boolean = false;
  hideCancel: boolean = false
  
    constructor(
      public dialogRef: MatDialogRef<any>,
      @Inject(MAT_DIALOG_DATA) public data: DataParams
    ) {
      
    }


  
    ngOnInit() {
      const { keys = [], hideCancel = false, creating = false, doc = null, classes = {}, updateCallback = () => console.log('no updateCallback provided') } = this.data;
      this.doc = doc;
      this.classes = classes;
      this.keys = keys;
      this.creating = creating;
      console.log({creating})
      this.hideCancel = hideCancel;
      this.updateCallback = updateCallback;
    }
  
  ngOnDestroy() {
    if (!!this.updateCallback) this.updateCallback(this.doc);
  }

}