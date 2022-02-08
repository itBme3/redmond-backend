import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { ResizeImageOptions, UploadService } from 'projects/redmond-fire-library/src/lib/services/upload.service';
import { AUDIO_FILE_EXTENSIONS, DOCUMENT_FILE_EXTENSIONS, IMAGE_FILE_EXTENSIONS, VIDEO_FILE_EXTENSIONS } from 'projects/redmond-fire-library/src/lib/services/funcs';
import {MediaType } from 'projects/redmond-fire-library/src/lib/models/docs'

@Component({
  selector: 'app-uploader-task',
  templateUrl: './uploader-task.component.html',
  styleUrls: ['./uploader-task.component.scss'],
  inputs: ['file', 'storagePath', 'databasePath', 'docData']
})
export class UploaderTaskComponent implements OnInit {

  @Input() file: File;
  _file: File;
  @Input() storagePath: string | null = 'public';
  @Input() databasePath: string | null = 'uploads';
  @Input() resizeOptions: ResizeImageOptions
  @Input() docData: { [key:string]: any } = {  }
  defaultResizeOptions:ResizeImageOptions = {
    maxMbs: .65,
    keepAspectRatio: true
  }

  @Output() completedTask = new EventEmitter<any>()

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  filename: string
  pdfSrc: { url: string; withCredentials: boolean; } | false = false;

  constructor(private storage: AngularFireStorage, private db: DbService, private uploadService: UploadService) { }

  async ngOnInit() {
    this.resizeOptions = !!!this.resizeOptions ? this.defaultResizeOptions : { ...this.defaultResizeOptions, ...this.resizeOptions }
    this._file = this.file.type.includes('image') && this.file.size > this.resizeOptions.maxMbs * 1000000 ?
      await this.uploadService.handleImageFile(this.file, this.resizeOptions)
      : this.file;
    return this.startUpload();
  }



  startUpload() {
    // The storage path
    const name = `${Date.now()}_${this.file.name}`;
    const path = `${this.storagePath}/${name}`;
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // The main task
    this.task = this.storage.upload(path, this._file);
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        const { name: filename, size: size, type: fileType } = this._file;
        const mediaType = mediaTypeFromFile(this._file)
        if (fileType.includes('pdf'))
          this.pdfSrc = { url: this.downloadURL, withCredentials: true };
        const payload = { alt: null, mediaType, ...this.docData, src: this.downloadURL, path, name, filename, size, fileType };
        return this.db.updateAt(this.databasePath, payload)
          .then((doc) => this.completedTask.emit(doc))
          .catch(err => { throw err });
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}

export const mediaTypeFromFile = (file: { name?: string, fileType?: string, } | string) => {
  let { fileType = null, name = null } = typeof file === 'string' ? { name: file } : file;
  if (!!!fileType && !!!name) return null;
  if (!!!fileType) fileType = fileTypeFromPath(name);
  return Object.values(MediaType).reduce((acc: string, mType: string) => {
    if (!!!acc && !!fileType &&(fileType.includes(mType) || fileType === mType)) return mType;
    return acc;
  }, null);
}


export const fileTypeFromPath = (path: any):any => {
  
  const fileExtensions:any = {
    image: IMAGE_FILE_EXTENSIONS,
    video: VIDEO_FILE_EXTENSIONS,
    document: DOCUMENT_FILE_EXTENSIONS,
    file: AUDIO_FILE_EXTENSIONS,
  };
  return Object.keys(fileExtensions)
      .reduce((ext: any, listKey: string) => {
        const extList = fileExtensions[listKey];
        if (!path) return false;
        if (ext) return ext;
        const potentialExtension = path.split('.').pop().split('?')[0].toLowerCase().trim();
        if (!potentialExtension || potentialExtension === '') return false;
        const foundExtension = extList.filter((ex: any) => {
          if (!path) return false;
          return ex === potentialExtension;
        })[0];
        if (!foundExtension) return null;
        return `${listKey}/${foundExtension}`;
      }, null);
};
