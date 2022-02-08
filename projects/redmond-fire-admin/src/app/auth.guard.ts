import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { UserDoc } from 'projects/redmond-fire-library/src/lib/models/user';
import { SnackService } from './services/snack.service';
import { UserService } from 'projects/redmond-fire-library/src/lib/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
      private userService: UserService,
      private snacks: SnackService,
      private router: Router,
    ) { }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const rejected = (redirectTo = '/login') => {
      this.snacks.authError(false, redirectTo)
      return false
    }
    const userAuth = await this.userService.auth_CurrentUser().catch(console.error);
    if (!!!userAuth) return rejected('/login');
    const user: UserDoc = await this.userService.userInDb(userAuth.uid)
      .catch(err => { console.error(err.message); return null })

    if (!!!user || !!!user?.access?.role && !['team', 'admin'].includes(user.access.role)) {
      return rejected('https://redmondconstruction.com')
    }
    return true;
      
  }
}
