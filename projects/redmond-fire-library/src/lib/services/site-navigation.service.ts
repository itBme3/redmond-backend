import { Injectable } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiteNavigationService {

  navigation
  footer
  
  constructor(private db: DbService) {
    this.db.doc$('public/navigation').pipe(take(1)).toPromise().then(doc => this.navigation = doc);
    this.db.doc$('public/footer').pipe(take(1)).toPromise().then(doc => this.footer = doc);
  }
  
  async initSiteNavAndFooter(): Promise<{ navigation: any; footer: any }> {
    const navigation = !!this.navigation ? this.navigation : await this.db.doc$('public/navigation').pipe(take(1)).toPromise().then(doc => this.navigation = doc);
    const footer = !!this.footer ? this.footer : await this.db.doc$('public/footer').pipe(take(1)).toPromise().then(doc => this.footer = doc);
    return { footer, navigation }
  }

}
