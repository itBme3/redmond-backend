import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { COLLECTION_TYPES, OPTIONS_COLLECTION_TYPES } from 'projects/redmond-fire-library/src/lib/models/collections';

@Injectable({ providedIn: 'root' })

export class CollectionResolver implements Resolve<any> {

      constructor() { }

      async resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Promise<any> {
            const page: any = route.paramMap.get('page');
            return [...COLLECTION_TYPES, ...OPTIONS_COLLECTION_TYPES].includes(page) ? page : null
      }
}
