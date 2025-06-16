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
    // Rutas públicas
    const publicRoutes = ['/login', '/inicio', '/crearcliente'];
    if (publicRoutes.includes(state.url)) return true;

    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Verificar si está bloqueado
    if (this.authService.isBlocked()) {
      this.router.navigate(['/blocked']);
      return false;
    }

    // Verificar roles
    const requiredRoles = route.data['roles'] as Array<number>;
    if (requiredRoles && !requiredRoles.includes(this.authService.getPermiso())) {
      this.router.navigate(['/no-autorizado']);
      return false;
    }

    return true;
  }
}