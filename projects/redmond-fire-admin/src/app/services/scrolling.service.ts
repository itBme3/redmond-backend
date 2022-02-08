import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollingService {

      subscriptions: Subscription[] = []

      constructor() { }

      scrollToElement(elem:any, scrollRef:any, options?: { duration?: number, easeFunc?:string }) {
            const { duration = 300, easeFunc = 'ease-out' } = options;
            if (!!!elem || !!!scrollRef?.scrollToElement) return;
            return scrollRef.scrollToElement(elem, duration, easeFunc);
      }

      scrollTo(position: number | { left: number; top: number }, scrollRef, options?: { duration?: number; easeFunc?: string; }) {
            if (position === undefined || position === null || !!!scrollRef?.scrollTo) return;
            const { duration = 300, easeFunc = 'ease-out' } = !!!options ? {} : options;
            return scrollRef.scrollTo(typeof position === 'number' ? { top: position, left: 0 } : position, duration, easeFunc);
      }

}