import { Injectable } from '@angular/core';

function _document() : any {
   // return the global native browser document object
   return typeof document !== 'undefined' ? document : {};
}

@Injectable()
export class DocumentRef {
   get nativeDocument() : any {
      return _document();
   }
}