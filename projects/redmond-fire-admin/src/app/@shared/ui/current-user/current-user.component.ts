import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from 'projects/redmond-fire-library/src/lib/services/user.service';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit {

  user: any
  constructor(public afAuth: AngularFireAuth, private userService: UserService, private router: Router ) { }

  ngOnInit(): void {
    this.userService.currentUser().then(user => this.user = user);
  }
  
  logout() {
    this.afAuth.signOut();
    this.router.navigateByUrl('/login')
  }

}
