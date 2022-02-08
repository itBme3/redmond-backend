import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { DbService } from '../services/db.service';
import { take } from 'rxjs/operators';
import { PageDoc, SiteCollectionType } from '../models/docs';


@Injectable({ providedIn: 'root' })
export class SitePageResolver implements Resolve<any> {

      constructor(private db: DbService) { }

      async resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Promise<any> {
            const isHomePage = route?.data?.isHomePage
            if (!!isHomePage)
                  return await this.db.collection$('admin/pages/collection',
                        ref => ref.where('handle', '==', '/')).pipe(take(1)).toPromise();
            const handle: string = route.paramMap.get('handle');
            const collection: SiteCollectionType = route?.data?.collection;
            let doc = await this.db.collection$(
                  `admin/${!!!collection ? 'pages' : collection}/collection`,
                  ref => ref.where('handle', '==', handle).limit(1)
            ).pipe(take(1)).toPromise();
            if (!!doc[0]?.docId) return doc[0];
            const redirectPath = collection !== 'pages' ? `/${collection}/${handle}` : `/${handle}`;
            const foundRedirect = this.db.collectionGroup$('collection',
                  ref => ref.where('redirects', 'array-contains', redirectPath).limit(1)
            ).pipe(take(1)).toPromise();
            if (!!foundRedirect[0]?.docId) return doc[0];
            return 404
      }
}