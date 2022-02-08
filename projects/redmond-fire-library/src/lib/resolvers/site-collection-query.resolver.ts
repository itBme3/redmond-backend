import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PostType } from '../models/collections';


@Injectable({ providedIn: 'root' })

export class SiteCollectionQueryResolver implements Resolve<any> {

      constructor() { }

      async resolve(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): Promise<any> {
            const collection = route?.data?.collection;
            const dbQuery: { [key:string]: any } = {
                  limit: 10,
                  orderBy: collection === 'projects' ? 'order,asc' : collection === 'posts' ? 'publishedAt,desc' : 'createdAt,desc',
                  where: [['status', '==', 'published']]
            };
            const hashFragment = route.fragment;
            if (collection === 'projects') {
                  if (!!hashFragment?.length) {
                        if (!Array.isArray(dbQuery?.where))
                              dbQuery.where = [];
                        dbQuery.where.push(['sector', '==', hashFragment.toLowerCase()])
                  }
            }
            if (Object.values(PostType).includes(collection) && collection !== 'posts') {
                  if (!Array.isArray(dbQuery?.where))
                        dbQuery.where = [];
                  dbQuery.where.push(['category', '==', collection.toLowerCase()])
            }
            return dbQuery;
      }
}