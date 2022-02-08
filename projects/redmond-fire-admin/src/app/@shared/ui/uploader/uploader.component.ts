import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import * as Funcs from 'projects/redmond-fire-library/src/lib/services/funcs'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  inputs: ['docData', 'storagePath', 'databasePath']
})
export class UploaderComponent {
  @Input() docData: any = {}
  @Input() storagePath: string = 'public'
  @Input() databasePath: string = 'uploads'

  @Output() uploadsCompleted = new EventEmitter<any[]>()
  @Output() uploadTaskCompleted = new EventEmitter<any>()

  isHovering: boolean;
  files: File[] = [];
  uploaded: any = [];
  uploadingFromUrl: string | false = false
  uploadingFromUrlPreview: string | false;
  uploadingFromUrlFileType: string | false;
  funcs = Funcs
  completedUploads: any[] = []

  constructor(private db: DbService) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  async upload_FromUrl() {
    if (!!!this.uploadingFromUrlPreview || this.uploadingFromUrlPreview === 'invalid') return false;
    const src = this.uploadingFromUrlPreview;
    const filetype = this.funcs.get_Filetype(src);
    const filename = src.split('/').pop().split('?')[0];
    return await this.db.updateAt('uploads', { src, filetype, external: true, filename }).catch(console.error)
  }

  async load_PreviewUploadFormatUrl(value) {
    this.uploadingFromUrl = value.trim();
    if (!!!value) return this.uploadingFromUrlPreview = false;
    const isValid = await this.is_UrlValid(value).catch(err => { throw err });
    if (!!!isValid) {
      this.uploadingFromUrlFileType = false;
      return this.uploadingFromUrlPreview = false;
    }
    this.uploadingFromUrlPreview = value;
    this.uploadingFromUrlFileType = this.funcs.get_Filetype(this.uploadingFromUrl);
    return this.uploadingFromUrlPreview
  }


  async is_UrlValid(a_url: string) {
    return new Promise((resolve) => {
      try {
        var x = new XMLHttpRequest();
        x.timeout = 1000;
        x.open('GET', a_url);
        x.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }
        x.send();
      } catch (errs) {
        resolve(false)
      }
    });
  }

  completed_Task(upload) {
    this.uploadTaskCompleted.emit(upload)
    this.uploaded.push(upload);
    if (this.files.length === this.uploaded.length) {
      this.uploadsCompleted.emit(JSON.parse(JSON.stringify(this.uploaded)))
      Funcs.setTimeout$(() => {
        // this.uploaded = [];
        this.files = [];
      }, 500);
    }
  }
}


/*
---------------------------------------
COMPONENT: UPLOADER DIALOG
---------------------------------------
*/
interface DataParams { docData, storagePath: string, databasePath: string, uploadTaskCompleted: Function, uploadsCompleted: Function };
@Component({
  template: `
    <div class="w-full relative py-2">
      <button class="close-button absolute -right-1 top-1 flex items-center p-2 rounded hover:text-rcc-red hover:bg-gray-50 z-10"
        (click)="dialog.close()"><mat-icon>close</mat-icon>
      </button>
      <app-uploader
        [docData]="docData"
        [storagePath]="storagePath"
        [databasePath]="databasePath"
        (uploadsCompleted)="uploadsCompleted($event)"
        (uploadTaskCompleted)="uploadTaskCompleted($event)">
      </app-uploader>
    </div>
  `,
  styles: [
    `:host {
      @apply relative;
      .close-button {
        @apply absolute right-1 top-1;
      }
    }`
  ]
})
export class UploaderDialogComponent implements OnInit {

  docData = {};
  storagePath = 'public';
  databasePath = 'uploads';

  uploadsCompleted: Function = (e) => e;
  uploadTaskCompleted: Function = (e) => e;

  constructor(
    public dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: DataParams) {
    const {
      docData = this.docData,
      storagePath = this.storagePath,
      databasePath = this.databasePath,
      uploadTaskCompleted = this.uploadTaskCompleted,
      uploadsCompleted = this.uploadsCompleted } = data;
    this.docData = docData;
    this.storagePath = storagePath;
    this.databasePath = databasePath;
    this.uploadTaskCompleted = uploadTaskCompleted;
    this.uploadsCompleted = uploadsCompleted;
  }

  ngOnInit() { }

}