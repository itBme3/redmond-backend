import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResponsiveSize, ResponsiveClassPrefix, ResponsiveSizeQueries, ScreenBreakpoint } from '../models/responsive';
import $ from 'jquery';
import { DocumentRef } from './document-ref';

@Injectable({
      providedIn: 'root'
})
export class BreakpointService {
      private Responsive = new BehaviorSubject<ScreenBreakpoint>(null);
      responsive = this.Responsive.asObservable();
      _responsive: ScreenBreakpoint = null

      constructor(private docRef: DocumentRef) { }
      getResponsiveSize(value: string | number | null, get: 'name' | 'prefix') {
            if (typeof value === 'string') {
                  if (Object.keys(ResponsiveSize).includes(value))
                        return get === 'name' ? ResponsiveSize[value] : ResponsiveClassPrefix[ResponsiveSize[value]];
                  if (Object.keys(ResponsiveSizeQueries).includes(value))
                        return get === 'name' ? value : ResponsiveSize[value];
            }
            if (typeof value === 'number')
                  return Object.keys(ResponsiveSizeQueries).reduce((res, key) => {
                        if (!!res) return res;
                        const min = ResponsiveSizeQueries[key].includes('min-width') ?
                              parseInt(ResponsiveSizeQueries[key].split('min-width: ')[1].split('px')[0]) :
                              0;
                        const max = ResponsiveSizeQueries[key].includes('max-width') ?
                              parseInt(ResponsiveSizeQueries[key].split('max-width: ')[1].split('px')[0]) :
                              9e9;
                        if (value > min && value < max)
                              return key;
                  }, null);
            return get === 'name' ? 'DEFAULT' : '';
      }

      setResponsive(widthOrName: number | string) {
            let width: number | string = (() => {
                  if (!!widthOrName) return widthOrName;
                  let container = this.docRef.nativeDocument.querySelector('app-admin-microsite-entity-sections');
                  if (container.length === 0) container = this.docRef.nativeDocument.querySelector('app-microsite-entity-sections');
                  if (container.length > 0)
                        return container.offsetWidth;
                  return null
            })();
            this._responsive = this.getResponsiveSize(width, 'name')
            return this.Responsive.next(this._responsive)
      }
}