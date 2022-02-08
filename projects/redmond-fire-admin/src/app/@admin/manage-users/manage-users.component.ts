
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserDoc, USER_ROLE_COLORS } from 'projects/redmond-fire-library/src/lib/models/user';
import { ManageUserDialogComponent } from './manage-user-dialog/manage-user-dialog.component';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs'
import { UserService } from 'projects/redmond-fire-library/src/lib/services/user.service'
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service'


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy {

  pages: any = []
  avatar: string = ''
  users$: Observable<UserDoc[]>
  users: UserDoc[]
  subscriptions: Subscription[] = []
  showFilters: boolean = true
  roleColor = USER_ROLE_COLORS
  search = ''
  filterOptions = {
    sort: [
      { value: ['createdAt', 'desc'], label: 'created (soonest)' },
      { value: ['updatedAt', 'desc'], label: 'updated (soonest)' },
      { value: ['email', 'asc'], label: 'email (A to Z)' },
      { value: ['email', 'desc'], label: 'email (Z to A)' },
    ],
    role: ['admin', 'team', 'user', 'any'].map(key => {
      return {
        color: key === 'any' ? 'darken-03' : this.roleColor[key],
        value: key === 'any' ? null : key, label: key
      }
    }),
    // canAccess: [ 'any'].map(key => {
    //     return { value: key === 'any' ? null : key, label: key.split('-').join(' ') }
    //   })
  }
  activeFilters = {
    sort: ['createdAt', 'desc'],
    role: null,
    canAccess: null
  }

  filterOptionsKeys = Object.keys(this.filterOptions)

  searchFieldOptions = ['email', 'phoneNumber', 'name', 'uid']
  searchFields: string[] = null

  funcs = FUNCS

  
  constructor(private userService: UserService, private route: ActivatedRoute,  public dialog: MatDialog, private db: DbService, private location: Location) {
    
  }

  ngOnInit(): void {
    this.getUsers().then(users => {
      this.subscriptions.push(
        this.route.paramMap.subscribe((paramMap: any) => {
          const editUid = !!paramMap?.params?.docId ? paramMap.params.docId: null;
          if (!!editUid) {
            const editUser = this.users.filter(u => u.uid === editUid)[0];
            if (!!!editUser) return;
            this.editUser(editUser);
          }
        })
      )
    });
  }

  get activeSortLabel() {
    return this.filterOptions.sort.filter(f => f.value[0] === this.activeFilters.sort[0] && f.value[1] === this.activeFilters.sort[1])[0].label
  }

  async getUsers() {
    return await this.userService.getUsers().then(users => {
      this.users = users;
      return this.users
    });
  }

  get filteredUsers() {
    if(!!!this.users?.filter) return []
    return this.users.filter((user) => {
      const searchFields = !!!this.searchFields ? this.searchFieldOptions : this.searchFields
      const searchText = `${searchFields.map(key => user[key]).join(' ').toLowerCase()}`;
      const words = this.search.split(' ');
      if (!!this.activeFilters.role && this.activeFilters.role !== user?.access?.role)
        return false;
      if (!!this.activeFilters.canAccess && user.access.role !== 'admin' && !user.access.canAccess.includes(this.activeFilters.canAccess))
        return false;
      return words.filter(word => searchText === word || searchText.includes(word.toLowerCase())).length === words.length
    }).sort(this.funcs.sortCompare(this.activeFilters.sort[0], this.activeFilters.sort[1]))
  }

  formatUserCard(user) {
    return { 
      title: !!user?.name?.length ? user.name : user.displayName, 
      text: user.email,
      tags: user.canAccess,
      titleTag: 'h4',
      image: !!user?.photoURL ? { src: user.photoURL } : null,
      cardStyle: 'media-aside',
      cardClasses: 'cursor-pointer border border-1 border-darken-01 border-white-hvr bg-white-hvr bg-lighten-001 transform scale-098 transform scale-1-hvr p-2 mat-elevation-z0 mat-elevation-z10-hvr items-center flex-nowrap'
    }
  }

  editUser(user) {
    const dialogData = {
      maxWidth: '300px',
      width: 'calc(100% - 2em)',
      backdropClass: ['bg-black','bg-opacity-5'],
      closeOnNavigation: true,
      panelClass: 'manage-user-dialog',
      autoFocus: false,
      data: JSON.parse(JSON.stringify(user)),
    };
    this.location.go(`/users/${user.uid}`)
    const dialogRef = this.dialog.open(ManageUserDialogComponent, dialogData);
    dialogRef.afterClosed().pipe(take(1)).subscribe(async (updatedUser) => {
      if (!!updatedUser) {
        const userAccess = JSON.parse(JSON.stringify(updatedUser.access));
        const user = JSON.parse(JSON.stringify(updatedUser));
        delete user.access;
        await Promise.all([
          this.db.updateAt(`users/${user.uid}`, user),
          this.db.updateAt(`user_access/${user.uid}`, userAccess)
        ]).then(() => 
          this.users = [...this.users.filter(u => u.uid !== updatedUser.uid), updatedUser]
        )
      }
      this.location.go('/users')
    });
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }

}
