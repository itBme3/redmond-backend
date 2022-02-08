import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute,  Router, } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserDoc, UserRole } from 'projects/redmond-fire-library/src/lib/models/user';
import { SnackService } from '../../../services/snack.service';
import { UserService } from 'projects/redmond-fire-library/src/lib/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  inputs: []
})
export class LoginComponent implements OnInit {

  auth_state: any = false
  isAdminLogin: boolean = false;
  loginWithEmail: boolean = false
  year = new Date().getFullYear();
  
  

  constructor(public afAuth: AngularFireAuth, private userService: UserService, private route: ActivatedRoute, private router: Router, private snacks: SnackService) {
    
  }

  async ngOnInit() {
    this.afAuth.authState.subscribe(async (user:{[key: string]: any}) => {
      if (!!!user) return;
      const userDoc: UserDoc | false = await this.userService.userInDb(user.uid).catch(err => { console.error(err.message); return null})
      if (!!userDoc && !!userDoc?.access && [UserRole.ADMIN, UserRole.TEAM].map(r => `${r}`).includes(userDoc?.access?.role))
        return await this.router.navigateByUrl('/')
    });
  }

  getAuthState() {
    return this.afAuth.authState.pipe(take(1)).toPromise().then(auth_state => {
      this.auth_state = auth_state
      return auth_state
    });
  }

}
