import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: LoginService, private router: Router) {}

login() {
  this.errorMessage = ''; // Limpiar mensajes de error previos
  //alert("Iniciando login...");

  this.authService.login({ username: this.username, password: this.password })
    .subscribe({
      next: (response: any) => {
        //console.log('Respuesta completa del servidor:', response); // Debug
        //alert("Respuesta recibida del servidor");

        if (response?.token && response?.user?.permiso !== undefined) {
          this.authService.saveUserData(
            response.token,
            response.user.permiso,
            response.user.username
          );

          alert(`Bienvenido ${response.user.username}`);
          this.router.navigate(['/inicio']); // Redirige independientemente del permiso
        } else {
          this.errorMessage = 'Estructura de respuesta inválida';
          console.error('Estructura de respuesta incorrecta:', response);
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = err.error?.message || 'Error al conectar con el servidor';
        alert(`Error: ${this.errorMessage}`);
      }
    });
  }
}