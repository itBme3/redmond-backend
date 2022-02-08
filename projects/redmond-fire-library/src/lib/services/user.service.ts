import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import {  take } from 'rxjs/operators';
import { AdminPage, ADMIN_PAGES } from 'projects/redmond-fire-library/src/lib/constants/admin-pages';
import { UserDoc, UserAccessDoc, UserRole } from 'projects/redmond-fire-library/src/lib/models/user';
import * as funcs from 'projects/redmond-fire-library/src/lib/services/funcs';
import { HttpClient } from '@angular/common/http';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';

export interface ColorDoc { name: string; value: string }
export interface ColorDocs { defaultColors: ColorDoc[]; userColors: ColorDoc[] }


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userAccess$ = of(null);
  users$: Observable<UserDoc[]>
  funcs = funcs

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private db: DbService, private http: HttpClient) { }

  async getUsers(): Promise<UserDoc[]> {
    let users;
    let userAccess;
    return await Promise.all([
      this.db.collection$('users').pipe(take(1)).toPromise().then(res => users = res),
      this.db.collection$('user_access').pipe(take(1)).toPromise().then(res => userAccess = res)
    ]).then(() => {
      return users.map(u => {
        return {...u, access: userAccess.filter(uA => uA.uid === u.uid)[0] }
      });
    }).catch(console.error);

  }

  userInDb(uid): Promise<UserDoc | false> {
    const ref = this.afs.doc(`users/${uid}`).ref;
    return ref.get().then((snap:any) => {
      if (!!snap.exists) {
        
        const userData = snap.data();
        if (!!!userData.photoURL) {
          userData.photoURL = this.defaultAvatar();
          this.db.updateAt(`users/${uid}`, { photoURL: userData.photoURL })
            .catch(err => console.error(err.message))
        }
        // this.userAccess$ = this.db.doc$(`user_access/${uid}`);
        const accessRef = this.afs.doc(`user_access/${uid}`).ref;
        return accessRef.get().then(access => {
            return {
              ...userData,
              access: access.data()
            }
        }).catch(err => { console.error(err); throw err });
      }
      return this.onboard_User().catch(console.error);
    })
  }

  async auth_CurrentUser() {
    let user = null;
    const attempts = 10;
    for (let i = 0; i < attempts; i++) {
      if (!!!user) {
        await this.funcs.asyncDelay(100)
        user = await this.afAuth.currentUser;
      }
    }
    return user
  }

  async currentUser() {
    return this.auth_CurrentUser().then(async user => {
      this.userAccess$ = (this.db.doc$(`user_access/${user.uid}`));
      return await this.userInDb(user.uid)
    })
  }

  async getCurrentUserAccess(): Promise<UserAccessDoc> {
    try {
      return await this.auth_CurrentUser().then(async user =>
        await this.db.doc$(`user_access/${user.uid}`)
          .pipe(take(1)).toPromise()
            .catch(_err =>  {throw new Error(_err.message)})
      ).catch((err) => { throw new Error(err.message) })
    } catch (errs) {
      console.error(errs.message);
      return null
    }
  }
  
  async onboard_User() {
    const user:any = await this.afAuth.authState.pipe(take(1)).toPromise()
      .catch(errs => { console.error(errs.message); return false });
    if (!!!user) return false;
    
    const { uid, email, phoneNumber, isAnonymous } = user;
    let { displayName, photoURL } = user;
    if (!!!photoURL) photoURL = this.defaultAvatar();
    if (!!!displayName && !!email && email.includes('@')) displayName = email.split('@')[0];
    const { creationTime: createdAt, lastSignInTime: lastLoginAt } = user.metadata;
    const userData = {
      uid, name: displayName, photoURL, email, phoneNumber, isAnonymous, createdAt, lastLoginAt, firstName: null, lastName: null,
      updatedAt: Date.now(),
    }
    const access:UserAccessDoc = {
      uid, role: UserRole.USER, updatedAt: Date.now(), createdAt, canAccess: []
    }
    // this.afs.doc(`user_access/${uid}`).set(access).catch(err => { throw err })
    return this.afs.doc(`users/${uid}`).set(userData)
      .then(() => {return {...userData, access}})
    .catch(err => { throw err })
  }

  async getColors(): Promise<ColorDocs> {
    const userId = await this.auth_CurrentUser().then(u => !!u && !!u.uid ? u.uid : null);
    const defaultColors: ColorDoc[] = await this.db.doc$('options/--colors--').pipe(take(1)).toPromise()
      .then(d => d.colors);
    let userColors = !!userId ? await this.db.doc$(`users/${userId}/options/--colors--`)
      .pipe(take(1)).toPromise().then(doc => !!doc && !!doc.colors ? doc.colors : null) : [];
    if ( !!!userColors ) {
      userColors = [];
      await this.db.updateAt( `users/${userId}/options/--colors--`, {colors: []} );
    }
    return { defaultColors, userColors };
  }

  async canAccessPages():Promise<AdminPage[]> {
    let access: UserAccessDoc = await this.getCurrentUserAccess()
      .catch(err => {
        console.error(err.message);
        return null
      });
    if (!!!access || !['admin', 'team'].includes(access.role))
      return [];
    if (access.role === 'admin')
      return ADMIN_PAGES;
    const restrictedPages = ['messages', 'users'];
    return ADMIN_PAGES.filter(page => {
      const pageHandle = page.path.split('/').pop();
      if (!restrictedPages.includes(pageHandle) || access.canAccess.includes(pageHandle))
        return true;
      return false;
    })
  }

  defaultAvatar() {
    return `../assets/media/avatars/${this.funcs.randomInt(0, 6)}.png`
  }
  
  
  async getIpAddress(): Promise<{ip: string}> {
   return await this.http.get("https://api.ipify.org/?format=json").pipe(take(1)).toPromise()
     .catch(err => { console.error(err.messsage); return null})
  }
  
  
}

