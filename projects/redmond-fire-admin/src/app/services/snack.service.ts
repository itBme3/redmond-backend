import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { WindowRef } from 'projects/redmond-fire-library/src/lib/services/window-ref';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SnackService {


  constructor(private snackBar: MatSnackBar, private router: Router, private location: Location) { }

  authError(params: any = false, redirect: string = '/login') {
    this.snackBar.open('Unauthorized: you must be logged in with adequate credentials.', 'OK', {
      duration: 0,
      verticalPosition: 'top',
      panelClass: ['shadow-md','auth_error_snackbar', 'bg-gray-800'],
      ...params
    });
    const openRedirect = () => {
      if (redirect.includes('http')) return this.location.go(redirect);
      return this.router.navigateByUrl(redirect)
    }
    
    this.snackBar._openedSnackBarRef.afterDismissed()
      .pipe(tap(_ => openRedirect()))
      .subscribe();
    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(tap(_ => openRedirect()))
      .subscribe();
  }
}
