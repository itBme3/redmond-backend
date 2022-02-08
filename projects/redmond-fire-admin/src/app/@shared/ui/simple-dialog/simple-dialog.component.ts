import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface DataParams { title: string, button: string, text: string, onlyButton: boolean, classes?: { button?: string, title?: string }, hideCancel?: boolean };

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss']
})
export class SimpleDialogComponent implements OnInit {

  title = 'Are you sure?';
  text = null;
  button = 'yes';
  classes = {
    title: 'text-xl md:text-2xl text-grey-dark',
    text: 'text-base md:text-lg text-grey-light',
    button: 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800'
  }
  hideCancel: boolean = false
  onlyButton: boolean = false

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:DataParams
  ) {
    
  }

  ngOnInit(): void {
    const { title = this.title, text = this.text, button = this.button, hideCancel = false, onlyButton = this.onlyButton } = this.data;
    this.title = title;
    this.text = text;
    this.button = button;
    this.hideCancel = hideCancel;
    this.onlyButton = onlyButton;
    try {
      if (!!this.data?.classes && !!Object.keys(this.data.classes)?.length)
        Object.keys(this.classes).forEach(k => typeof this.data.classes[k] === 'string' ? this.classes[k] = this.data.classes[k] : '')
    } catch (errs) {
      console.error(errs.message)
    }
  }

}
