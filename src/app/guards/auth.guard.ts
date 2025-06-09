import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verifica si está autenticado y no está bloqueado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verifica si el usuario está bloqueado
    if (this.authService.isBlocked()) {
      this.router.navigate(['/blocked']);
      return false;
    }

    // Verifica roles específicos si están definidos en la ruta
    const requiredLevel = route.data['requiredLevel'];
    if (requiredLevel !== undefined) {
      const userLevel = this.authService.getUserLevel();
      
      if (userLevel < requiredLevel) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}