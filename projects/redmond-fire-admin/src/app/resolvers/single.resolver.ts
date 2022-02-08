import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';

@Injectable({ providedIn: 'root' })

export class SingleResolver implements Resolve<any> {

      constructor(private db: DbService) { }

      resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Observable<any> {
            const collection: any = route.paramMap.get('collection');
            const docId: any = route.paramMap.get('docId');
            return this.db.doc$(`admin/${collection}/collection/${docId}`)
      }
}
