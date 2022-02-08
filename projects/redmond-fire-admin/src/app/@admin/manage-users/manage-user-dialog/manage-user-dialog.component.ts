import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDoc } from 'projects/redmond-fire-library/src/lib/models/user';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';

@Component({
  selector: 'app-manage-user-dialog',
  templateUrl: './manage-user-dialog.component.html',
  styleUrls: ['./manage-user-dialog.component.scss']
})
export class ManageUserDialogComponent implements OnInit {

  canAccessKeys: string[] = [
    'messages',
    'users'
  ]
  user: UserDoc;
  revertUser: UserDoc;
  roleColor = {
    user: 'cyan',
    team: 'purple',
    admin: 'red'
  }

  funcs = FUNCS

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) data: UserDoc) {
    this.user = data
    this.revertUser = JSON.parse(JSON.stringify(data))
    }

  ngOnInit(): void {
  }

  get role() {
    return !!this.user?.access?.role ? this.user.access.role : null
  }

  set role(val) {
    if (!!this.user?.access)
      this.user.access.role = val
  }

  get photoURL() {
    return !!this.user?.photoURL ? this.user.photoURL : null
  }

  get changed() {
    return this.role !== this.revertUser.access.role || !this.funcs.check_ObjectsAreTheSame(this.canAccess, !!this.revertUser?.access?.canAccess ? this.revertUser.access.canAccess : [])
  }

  setCanAccess({key, val}) {
    if (!!!this.user.access) return;
    if (!!!this.user.access.canAccess)
      this.user.access.canAccess = [];
    if (!!val) {
      if(key === 'full-access') this.user.access.canAccess = JSON.parse(JSON.stringify(this.canAccessKeys));
      if(key !== 'full-access') this.user.access.canAccess.push(key);
    }
    if (!!!val) {
      if (key === 'full-access')
        this.user.access.canAccess = [];
      if(key !== 'full-access') 
        this.user.access.canAccess = this.user.access.canAccess.filter(k => k !== key)
    }
    if (!!!this.user?.access?.canAccess?.length) {
      this.user.access.role = 'user';
    } else {
      if (this.funcs.check_ObjectsAreTheSame(this.user.access.canAccess, this.canAccessKeys)) {
        this.user.access.role = 'admin';
      } else {
        this.user.access.role = 'team';
      }
    }
  }

  get canAccess():string[] {
    if (this.role === 'admin')
      return JSON.parse(JSON.stringify(this.canAccessKeys));
    return !!this.user.access?.canAccess ? this.user.access.canAccess : []
  }

  cancel() {
    this.user = this.revertUser;
    this.dialogRef.close(null);
  }

  save() {
    this.dialogRef.close(this.user)
  }

  

}
