import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { COLLECTION_TYPES, COLLECTION_DOC_ADMIN_PATH } from 'projects/redmond-fire-library/src/lib/models/collections';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';

@Injectable({ providedIn: 'root' })

export class CollectionDocResolver implements Resolve<any> {

      constructor(private db: DbService ) { }

      async resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Promise<any> {
            let page: any = route.paramMap.get('page');
            if (!!!page) page = route.paramMap.get('collection');
            if (!!!COLLECTION_DOC_ADMIN_PATH[page]) return null;
            return this.db[COLLECTION_DOC_ADMIN_PATH[page].split('/').length % 2 ? 'collection$' : 'doc$'](COLLECTION_DOC_ADMIN_PATH[page])
      }
}
