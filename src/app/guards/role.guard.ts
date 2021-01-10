import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.data.authorizedRole.indexOf(this.authService.getRole()) === -1) {
      this.authService.getRole() === 'ROLE_LUNCHLADY' ? this.router.navigate(['/canteen']) : this.router.navigate(['/']);
    }
    return route.data.authorizedRole.indexOf(this.authService.getRole()) !== -1;
  }

}
