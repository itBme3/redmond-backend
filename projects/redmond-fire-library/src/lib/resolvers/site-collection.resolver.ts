import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { DbService } from '../services/db.service';
import { take } from 'rxjs/operators';
import { SiteCollectionType } from '../models/docs';



@Injectable({ providedIn: 'root' })

export class SiteCollectionResolver implements Resolve<any> {

      constructor(private db: DbService) { }

      async resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Promise<any> {
            const collection: SiteCollectionType = route?.data?.collection;
            if (!!!collection) return null;
            return await this.db.doc$(`admin/${collection}`).pipe(take(1)).toPromise();
      }
}