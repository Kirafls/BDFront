import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/tienda';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(() => new Error('Error en el servidor'));
      })
    );
  }

  saveUserData(token: string, permiso: number, username: string): void {
  localStorage.setItem('token', token);
  localStorage.setItem('permiso', permiso.toString());  // Guarda como string
  localStorage.setItem('username', username);
  }

  getPermiso(): number {
    return parseInt(localStorage.getItem('permiso') || '0');  // Retorna 0 si no existe
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserLevel(): number {
    const level = localStorage.getItem('userLevel');
    return level ? parseInt(level) : 0; // Retorna 0 (bloqueado) si no existe
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUserLevel() > 0;
  }

  isAdmin(): boolean {
    return this.getUserLevel() === 2;
  }

  isSeller(): boolean {
    return this.getUserLevel() === 1;
  }

  isBlocked(): boolean {
    return this.getUserLevel() === 0;
  }

  // Opcional: Si realmente necesitas removeToken()
  removeToken(): void {
    localStorage.removeItem('token');
  }
}