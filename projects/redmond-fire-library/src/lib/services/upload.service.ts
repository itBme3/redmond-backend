import { Injectable } from "@angular/core";
import { NgxPicaService, NgxPicaErrorInterface } from '@digitalascetic/ngx-pica';
export interface ResizeImageOptions {
      maxMbs?: number;
      width?: number;
      height?: number;
      keepAspectRatio?: boolean;
}
@Injectable({
      providedIn: 'root'
})
export class UploadService {

      constructor(private _ngxPicaService: NgxPicaService) {}
      
      handleImageFile(file: File, resizeOptions: ResizeImageOptions = {}): Promise<File> {
            const { keepAspectRatio = true, maxMbs = .65 } = resizeOptions;
            const height = !!resizeOptions?.height ? resizeOptions.height : 2000;
            const width = !!resizeOptions?.width ? resizeOptions.width : 2000;
            return new Promise((resolve, reject) => {
                  if (file.size < maxMbs) resolve(file);
                  this._ngxPicaService.resizeImage(file, width, height,  {
                        exifOptions: { forceExifOrientation: keepAspectRatio },
                        aspectRatio: { keepAspectRatio: keepAspectRatio }
                  }).subscribe(async (imageResized: File) => {
                        if (imageResized.size <= maxMbs * 1000000)
                              return resolve(imageResized);
                        return await this.handleImageFile(imageResized, {...resizeOptions, width: width * .95, height: height * .95})
                              .then(res => resolve(res))
                              .catch(err => reject(err.message))
                  }, (err: NgxPicaErrorInterface) => {
                        reject(err.err);
                  });
            })
        
    }
}
