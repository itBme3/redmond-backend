import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ParamDocIdResolver implements Resolve<any> {

      constructor() { }

      resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Observable<any> {
            const docId: any = route.paramMap.get('docId');
            return !!docId ? docId : null;
      }
}
