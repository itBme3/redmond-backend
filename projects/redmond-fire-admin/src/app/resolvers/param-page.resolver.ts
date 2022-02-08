import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs';

@Injectable({ providedIn: 'root' })

export class ParamPageResolver implements Resolve<any> {

      constructor(private db:DbService) { }

      resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Observable<PageDoc> {
            const collection: string = route.paramMap.get('collection');
            const acceptedCollections = ['pages', 'posts', 'projects', 'team'];
            const docId: any = route.paramMap.get('docId');
            if (!!!collection || !acceptedCollections.includes(collection) || !!!docId) return of(null);
            return this.db.doc$(`admin/${collection}/collection/${docId}`)
      }
}
