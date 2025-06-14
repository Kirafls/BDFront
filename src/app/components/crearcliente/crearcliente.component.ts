import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CclienteService } from 'src/app/services/ccliente.service';

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

  constructor(private router: Router,private scliente:CclienteService) {}

  async onSubmit() {
  // Validación de campos obligatorios
  // Validación básica de RFC (puedes mejorarla)
  try {
    console.log('Enviando datos del cliente:', this.cliente);
    
    // Llamada al servicio
    const resultado = await this.scliente.crearCliente(
      this.cliente.nombre.trim(),
      this.cliente.apellidos.trim(),
      this.cliente.rfc.toUpperCase().trim()
    ).toPromise();

    console.log('Respuesta del servidor:', resultado);
    
    // Feedback al usuario
    alert('Información guardada correctamente');
    
    // Redirección
    this.router.navigate(['/inicio']);
    
    // Opcional: Resetear el formulario
    this.cliente = {
      nombre: '',
      apellidos: '',
      rfc: '',
      politica: false
    };

  } catch (error) {
    console.error('Error al crear cliente:', error);
    
    // Manejo específico de errores
  }
 }
}