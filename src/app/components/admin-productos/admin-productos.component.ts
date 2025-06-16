// admin-productos.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductosService, Producto } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css'],
})
export class AdminProductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  mostrarForm: boolean = false;
  modoEdicion: boolean = false;
  cargando: boolean = false;
  error: string = '';
  
  productoActual: Producto = {
    id: 0,
    nombre: '',
    unidad: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    categoria: '',
    activo: true
  };

  constructor(private productosService: ProductosService) { }

  ngOnInit() {
    this.cargarProductos();
  }

  // Cargar productos desde la API
  cargarProductos() {
    this.cargando = true;
    this.error = '';
    
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = [...productos];
        this.cargando = false;
      },
      error: (error) => {
        this.error = error;
        this.cargando = false;
        console.error('Error al cargar productos:', error);
      }
    });
  }

  get productosActivos(): number {
    return this.productos.filter(p => p.activo).length;
  }

  get productosStockBajo(): number {
    return this.productos.filter(p => p.stock < 10 && p.activo).length;
  }

  filtrarProductos() {
    if (!this.terminoBusqueda.trim()) {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        producto.categoria?.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  mostrarFormulario(modo: 'nuevo' | 'editar') {
    this.mostrarForm = true;
    this.modoEdicion = modo === 'editar';
    this.error = '';
    if (modo === 'nuevo') {
      this.limpiarFormulario();
    }
  }

  ocultarFormulario() {
    this.mostrarForm = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.productoActual = {
      id: 0,
      nombre: '',
      unidad: 'PZ',
      precio: 0,
      stock: 0,
      descripcion: '',
      categoria: '',
      activo: true
    };
    this.modoEdicion = false;
    this.error = '';
  }

  editarProducto(producto: Producto) {
    this.productoActual = { ...producto };
    this.mostrarFormulario('editar');
  }

  guardarProducto() {
    // Validaciones
    if (!this.productoActual.nombre.trim()) {
      this.error = 'El nombre del producto es obligatorio';
      return;
    }
    
    if (this.productoActual.precio <= 0) {
      this.error = 'El precio debe ser mayor a cero';
      return;
    }
    
    if (this.productoActual.stock < 0) {
      this.error = 'El stock no puede ser negativo';
      return;
    }

    this.cargando = true;
    this.error = '';

    const productoData = {
      nombre: this.productoActual.nombre.trim(),
      unidad: this.productoActual.unidad,
      precio: this.productoActual.precio,
      stock: this.productoActual.stock,
      descripcion: this.productoActual.descripcion?.trim() || '',
      categoria: this.productoActual.categoria?.trim() || '',
      activo: this.productoActual.activo
    };

    if (this.modoEdicion) {
      // Actualizar producto existente
      this.productosService.actualizarProducto(this.productoActual.id, productoData).subscribe({
        next: (response) => {
          console.log('Producto actualizado:', response.message);
          this.cargarProductos();
          this.ocultarFormulario();
          alert('Producto actualizado correctamente');
        },
        error: (error) => {
          this.error = error;
          this.cargando = false;
          console.error('Error al actualizar producto:', error);
        }
      });
    } else {
      // Crear nuevo producto
      this.productosService.crearProducto(productoData).subscribe({
        next: (response) => {
          console.log('Producto creado:', response.message);
          this.cargarProductos();
          this.ocultarFormulario();
          alert('Producto creado correctamente');
        },
        error: (error) => {
          this.error = error;
          this.cargando = false;
          console.error('Error al crear producto:', error);
        }
      });
    }
  }

  toggleEstado(producto: Producto) {
    this.cargando = true;
    const nuevoEstado = !producto.activo;
    
    this.productosService.cambiarEstadoProducto(producto.id, nuevoEstado).subscribe({
      next: (response) => {
        producto.activo = nuevoEstado;
        this.cargando = false;
        const estado = nuevoEstado ? 'activado' : 'desactivado';
        alert(`Producto ${estado} correctamente`);
        this.filtrarProductos(); // Actualizar vista filtrada
      },
      error: (error) => {
        this.cargando = false;
        this.error = error;
        console.error('Error al cambiar estado del producto:', error);
        alert('Error al cambiar el estado del producto');
      }
    });
  }

  eliminarProducto(producto: Producto) {
    if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
      this.cargando = true;
      
      this.productosService.eliminarProducto(producto.id).subscribe({
        next: (response) => {
          console.log('Producto eliminado:', response.message);
          this.cargarProductos();
          alert('Producto eliminado correctamente');
        },
        error: (error) => {
          this.cargando = false;
          this.error = error;
          console.error('Error al eliminar producto:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  // Método para reintentar en caso de error
  reintentar() {
    this.cargarProductos();
  }
}