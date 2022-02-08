import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Swiper from "swiper";
import { DocumentRef } from "./document-ref";

@Injectable({
  providedIn: 'root'
})
export class UiService {
      private ActiveSwiper = new BehaviorSubject<Swiper>(null);
      activeSwiper = this.ActiveSwiper.asObservable();
      _activeSwiper: Swiper

      private ResetSizing = new BehaviorSubject<Swiper>(null);
      resetSizing = this.ResetSizing.asObservable();

      private HasOverlayNav = new BehaviorSubject<boolean>(false);
      hasOverlayNav = this.HasOverlayNav.asObservable();

      constructor(private documentRef: DocumentRef) { }

       setActiveSwiper(swiper: Swiper) {
            this.ActiveSwiper.next(swiper)
       }
      
      triggerSizeReset() {
            this.ActiveSwiper.next(null);
      }

      setHasOverlayNav(val: boolean) {
            this.HasOverlayNav.next(val)
      }

      getScrollbarWidth() {
            // Creating invisible container
            if (!!!this.documentRef?.nativeDocument?.createElement) return;
            const outer:any = this.documentRef.nativeDocument.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll'; // forcing scrollbar to appear
            outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
            this.documentRef.nativeDocument.body.appendChild(outer);
            // Creating inner element and placing it in the container
            const inner = this.documentRef.nativeDocument.createElement('div');
            outer.appendChild(inner);
            // Calculating difference between container's full width and the child width
            const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
            // Removing temporary elements from the DOM
            outer.parentNode.removeChild(outer);
            return scrollbarWidth;
      }
      

}