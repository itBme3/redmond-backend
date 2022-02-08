import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AdminPage } from 'projects/redmond-fire-library/src/lib/constants/admin-pages';
import { Subscription } from 'rxjs';
import { UserService } from 'projects/redmond-fire-library/src/lib/services/user.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  inputs: []
})
export class NavigationComponent implements OnInit, OnDestroy {
  
  @Input() pages:AdminPage[]
  subdomain: string
  type: string

  
  
  hoveringNav:boolean = false;
  dataSubscription: Subscription;
  pageData: any = {}
  subdomains: string[] = [];
  user: any
  
  constructor(public afAuth: AngularFireAuth, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    return this.userService.canAccessPages()
      .then(pages => this.pages = pages)
      .catch(console.error);
  }

  navigateTo(path) {
    this.router.navigateByUrl(`/${path}`)
  }

  ngOnDestroy(): void {
    !!this.dataSubscription && this.dataSubscription.unsubscribe ? this.dataSubscription.unsubscribe() : ''
  }

}
