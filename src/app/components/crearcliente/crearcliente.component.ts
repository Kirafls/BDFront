import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-crearcliente',
  templateUrl: './crearcliente.component.html',
  styleUrls: ['./crearcliente.component.css']
})
export class CrearclienteComponent {
  cliente = {
    nombre: '',
    apellidos: '',
    rfc: '',
    politica: false
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.cliente.politica) {
      console.log('Formulario válido. Cliente:', this.cliente);
      this.router.navigate(['/inicio']);
      alert("Se ha guardado la informacion correctamente")
    } else {
      alert('Debes aceptar las políticas de privacidad.');
    }
  }
}