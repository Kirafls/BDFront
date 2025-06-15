import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroUsuarioPipe } from 'src/app/filtro-usuario.pipe';

@Component({
  standalone: true,
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  imports: [CommonModule, FormsModule, FiltroUsuarioPipe]  // ✅ Agrega esto
})
export class UsuarioComponent {
  model = {
    id: null,
    nombre: '',
    apellido: '',
    rol: '1',
    estado: true
  };

  usuarios: any[] = [];
  editIndex: number | null = null;
  terminoBusqueda: string = '';



  guardarUsuario() {
    if (this.editIndex !== null) {
      this.usuarios[this.editIndex] = { ...this.model };
      this.editIndex = null;
    } else {
      this.usuarios.push({ ...this.model });
    }
    this.limpiarFormulario();
  }

  editarUsuario(index: number) {
    this.model = { ...this.usuarios[index] };
    this.editIndex = index;
  }

  eliminarUsuario(index: number) {
    this.usuarios.splice(index, 1);
  }

  toggleEstado(index: number) {
    this.usuarios[index].estado = !this.usuarios[index].estado;
  }

  limpiarFormulario() {
    this.model = {
      id: null,
      nombre: '',
      apellido: '',
      rol: '1',
      estado: true
    };
  }

  getRolTexto(codigo: string) {
    return codigo === '1' ? 'Vendedor' : 'Administrador';
  }
  

get totalAdministradores(): number {
  return this.usuarios.filter(u => u.rol === '2').length;
}

get totalVendedores(): number {
  return this.usuarios.filter(u => u.rol === '1').length;
}


get totalActivos(): number {
  return this.usuarios.filter(u => u.estado === true).length;
}

get totalInactivos(): number {
  return this.usuarios.filter(u => u.estado === false).length;
}








}
