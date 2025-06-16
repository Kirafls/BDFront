import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
      private apiUrl = 'http://localhost:3000/tienda';
      private currentUserSubject = new BehaviorSubject<any>(null);

      constructor(private http: HttpClient, private router: Router) {
        this.initializeUserData();
      }

      private initializeUserData(): void {
        const token = localStorage.getItem('token');
        const permiso = localStorage.getItem('permiso');
        const username = localStorage.getItem('username');

        if (token && permiso && username) {
          this.currentUserSubject.next({
            token,
            permiso: parseInt(permiso),
            username
          });
        }
      }

      login(credentials: { username: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
          tap((response: any) => {
            if (response?.token && response?.user?.permiso !== undefined) {
              this.saveUserData(response.token, response.user.permiso, response.user.username);
              this.router.navigate([this.getRedirectRoute(response.user.permiso)]);
            }
          }),
          catchError((error) => {
            console.error('Error en la solicitud HTTP:', error);
            return throwError(() => new Error(error.error?.message || 'Error en el servidor'));
          })
        );
      }

      private getRedirectRoute(permiso: number): string {
        switch(permiso) {
          case 2: return '/admin/dashboard';
          case 1: return '/seller/dashboard';
          case 3: return '/visitor/dashboard';
          default: return '/';
        }
      }

      saveUserData(token: string, permiso: number, username: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('permiso', permiso.toString());
        localStorage.setItem('username', username);
        this.currentUserSubject.next({ token, permiso, username });
      }

      get currentUser$(): Observable<any> {
        return this.currentUserSubject.asObservable();
      }

      get currentUserValue(): any {
        return this.currentUserSubject.value;
      }

      getPermiso(): number {
        return this.currentUserValue?.permiso || parseInt(localStorage.getItem('permiso') || '0');
      }

      getToken(): string | null {
        return this.currentUserValue?.token || localStorage.getItem('token');
      }

      getUsername(): string | null {
        return this.currentUserValue?.username || localStorage.getItem('username');
      }

      logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('permiso');
        localStorage.removeItem('username');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      }

      isAuthenticated(): boolean {
        return this.getToken() !== null && this.getPermiso() > 0;
      }

      isAdmin(): boolean {
        return this.getPermiso() === 2;
      }

      isSeller(): boolean {
        return this.getPermiso() === 1;
      }

      isVisitor(): boolean {
        return this.getPermiso() === 3;
      }

      isBlocked(): boolean {
        return this.getPermiso() === 0;
      }
}