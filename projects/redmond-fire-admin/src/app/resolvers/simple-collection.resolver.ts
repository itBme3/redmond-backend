import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SIMPLE_COLLECTION_TYPES } from 'projects/redmond-fire-library/src/lib/models/collections';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class SimpleCollectionResolver implements Resolve<any> {

      constructor(private db: DbService) { }

      async resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Promise<any> {
            const collection = route.data.collection;
            if (!SIMPLE_COLLECTION_TYPES.includes(collection)) return null;
            return this.db.doc$(`admin/${collection}`).pipe(take(1)).toPromise();
      }
}
