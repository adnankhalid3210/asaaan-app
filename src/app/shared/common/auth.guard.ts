// import { AuthServiceService } from '../services/auth-service.service';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth.service';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate() {
        console.log('auth guard')
        let user = window.localStorage.getItem('user')
        if (user) {
            // this.router.navigate(['/account']);
            return true;
        } else {
            this.router.navigate(['/sign-in']);
        }
    }

}
