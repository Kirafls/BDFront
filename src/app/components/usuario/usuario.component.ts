import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NuserService } from 'src/app/services/nuser.service';

@Component({
  standalone: true,
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  imports: [CommonModule, FormsModule]  
})
export class UsuarioComponent implements OnInit {
  

  nuevoUsuario = {
    Id: 0,
    user: '',
    pass: '',
    nombre: '',
    apellido: '',
    permiso: '1'
  };

  empleados: any[] = [];
  editId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  mostrarFormularioNuevo() {
    this.editId = null;
    this.limpiarFormulario();
  }

  guardarUsuario() {
    if (this.editId) {
      this.actualizarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario() {
    this.isLoading = true;
    const datos = { ...this.nuevoUsuario, permiso: this.nuevoUsuario.permiso };
    
    this.usuarioService.crearEmpleado(datos).subscribe({
      next: () => {
        this.successMessage = 'Usuario creado correctamente';
        this.cargarEmpleados();
        this.limpiarFormulario();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al crear usuario: ' + (error.error?.message || '');
        this.isLoading = false;
      }
    });
  }

  actualizarUsuario() {
    this.isLoading = true;
    this.usuarioService.actualizarEmpleado(this.nuevoUsuario.Id, this.nuevoUsuario).subscribe({
      next: () => {
        this.successMessage = 'Usuario actualizado correctamente';
        this.cargarEmpleados();
        this.limpiarFormulario();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar usuario';
        this.isLoading = false;
      }
    });
  }


  constructor(private usuarioService: NuserService) {}

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.isLoading = true;
    this.errorMessage = '';
    this.usuarioService.getEmpleados().subscribe({
      next: (data: any[]) => {
        this.empleados = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar empleados';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  guardarCambios() {
    if (!this.nuevoUsuario.Id) {
      this.errorMessage = 'No se ha seleccionado un empleado para editar';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const datosActualizacion = {
      nombre: this.nuevoUsuario.nombre,
      apellido: this.nuevoUsuario.apellido,
      permiso: this.nuevoUsuario.permiso
    };

    this.usuarioService.actualizarEmpleado(this.nuevoUsuario.Id, datosActualizacion).subscribe({
      next: () => {
        this.successMessage = 'Empleado actualizado correctamente';
        this.cargarEmpleados();
        this.limpiarFormulario();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al actualizar empleado';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  async toggleEstado(empleado: any) {
  if (!empleado) return;

  const nuevoEstado = empleado.permiso === '0' ? '1' : '0';
  
  try {
    const confirmado = await this.confirmarCambio(empleado, nuevoEstado);
    if (!confirmado) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.usuarioService.cambiarEstado(empleado.Id, nuevoEstado).subscribe({
      next: () => {
        empleado.permiso = nuevoEstado;
        this.mostrarExito(`Estado cambiado a ${this.getPermisoTexto(nuevoEstado)}`);
      },
      error: (error) => {
        this.mostrarError(error.message || 'Error al cambiar estado');
        console.error('Detalles del error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  } catch (error) {
    this.isLoading = false;
    console.error('Error en toggleEstado:', error);
  }
}

private confirmarCambio(empleado: any, nuevoEstado: string): Promise<boolean> {
  const accion = nuevoEstado === '0' ? 'bloquear' : 'activar';
  const mensaje = `¿Está seguro de ${accion} a ${empleado.nombre}?`;
  return new Promise(resolve => {
    // Usa tu sistema de diálogos preferido
    resolve(confirm(mensaje));
  });
}
  private mostrarExito(mensaje: string) {
  // Implementa según tu sistema de notificaciones
  console.log('Éxito:', mensaje);
  this.successMessage = mensaje;
}

private mostrarError(mensaje: string) {
  // Implementa según tu sistema de notificaciones
  console.error('Error:', mensaje);
  this.errorMessage = mensaje;
}




  editarEmpleado(empleado: any) {
    this.nuevoUsuario = { ...empleado };
    this.editId = empleado.Id;
    this.errorMessage = '';
    this.successMessage = '';
  }

  limpiarFormulario() {
    this.nuevoUsuario = {
      Id: 0,
      user: '',
      pass: '',
      nombre: '',
      apellido: '',
      permiso: '1'
    };
    this.editId = null;
    this.errorMessage = '';
  }

  getPermisoTexto(codigo: string): string {
    switch(codigo) {
      case '0': return 'Bloqueado';
      case '1': return 'Vendedor';
      case '2': return 'Administrador';
      default: return 'Desconocido';
    }
  }
    getPermisoNum(codigo: string):number {
    switch(codigo) {
      case '0': return 0;
      case '1': return 1;
      case '2': return 2;
      default: return -1; // Valor por defecto si no coincide con ninguno
    }
  }

  get totalAdministradores(): number {
    return this.empleados.filter(e => e.permiso === '2').length;
  }

  get totalVendedores(): number {
    return this.empleados.filter(e => e.permiso === '1').length;
  }

  get totalActivos(): number {
    return this.empleados.filter(e => e.permiso !== '0').length;
  }

  get totalInactivos(): number {
    return this.empleados.filter(e => e.permiso === '0').length;
  }
}