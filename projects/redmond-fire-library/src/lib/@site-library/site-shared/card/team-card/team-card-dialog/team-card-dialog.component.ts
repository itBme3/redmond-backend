import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { animatedList, RevealContentAndChildren } from '../../../../../constants/animations';

@Component({
  selector: 'app-team-card-dialog',
  templateUrl: './team-card-dialog.component.html',
  styleUrls: ['./team-card-dialog.component.scss'],
  animations: [...RevealContentAndChildren, ...animatedList]
})
export class TeamCardDialogComponent implements OnInit {

  doc
  
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.doc = data.doc
    }
  
  ngOnInit() {
  }

  
}
