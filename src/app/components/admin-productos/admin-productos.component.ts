import { Component, OnInit } from '@angular/core';

interface Producto {
  id: number;
  nombre: string;
  unidad: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
  activo: boolean;
}

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})


export class AdminProductosComponent implements OnInit{

  productos: Producto[] = [
    { id: 1, nombre: 'Producto 1', unidad: 'PZ', precio: 100, stock: 50, categoria: 'Alimentos', descripcion: 'Producto de ejemplo', activo: true },
    { id: 2, nombre: 'Jitomate', unidad: 'KG', precio: 10, stock: 5, categoria: 'Alimentos', descripcion: 'Jitomate fresco', activo: true },
    { id: 3, nombre: 'Producto 3', unidad: 'PZ', precio: 30, stock: 25, categoria: 'Bebidas', descripcion: 'Producto descontinuado', activo: false },
    { id: 4, nombre: 'Producto 4', unidad: 'KG', precio: 21, stock: 75, categoria: 'Limpieza', descripcion: 'Producto de limpieza', activo: true },
    { id: 5, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 8, categoria: 'Alimentos', descripcion: 'Cebolla blanca', activo: true },
    { id: 6, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40, categoria: 'Bebidas', descripcion: 'Leche entera', activo: true },
    { id: 7, nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200, categoria: 'Alimentos', descripcion: 'Pan de caja', activo: true },
    { id: 8, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 8, categoria: 'Alimentos', descripcion: 'Cebolla blanca', activo: true },
    { id: 10, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40, categoria: 'Bebidas', descripcion: 'Leche entera', activo: true },
    { id: 11,  nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200, categoria: 'Alimentos', descripcion: 'Pan de caja', activo: true }
  ];

  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  mostrarForm: boolean = false;
  modoEdicion: boolean = false;
  
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

  ngOnInit() {
    this.productosFiltrados = [...this.productos];
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
    if (modo === 'nuevo') {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.productoActual = {
      id: 0,
      nombre: '',
      unidad: '',
      precio: 0,
      stock: 0,
      descripcion: '',
      categoria: '',
      activo: true
    };
    this.modoEdicion = false;
  }

  editarProducto(producto: Producto) {
    this.productoActual = { ...producto };
    this.mostrarFormulario('editar');
  }

  guardarProducto() {
    if (this.modoEdicion) {
      // Actualizar producto existente
      const index = this.productos.findIndex(p => p.id === this.productoActual.id);
      if (index !== -1) {
        this.productos[index] = { ...this.productoActual };
        alert('Producto actualizado correctamente');
      }
    } else {
      // Crear nuevo producto
      const nuevoId = Math.max(...this.productos.map(p => p.id)) + 1;
      const nuevoProducto = { ...this.productoActual, id: nuevoId };
      this.productos.push(nuevoProducto);
      alert('Producto creado correctamente');
    }
    
    this.filtrarProductos();
  }

  toggleEstado(producto: Producto) {
    producto.activo = !producto.activo;
    const estado = producto.activo ? 'activado' : 'desactivado';
    alert(`Producto ${estado} correctamente`);
  }

  eliminarProducto(producto: Producto) {
    if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
      const index = this.productos.findIndex(p => p.id === producto.id);
      if (index !== -1) {
        this.productos.splice(index, 1);
        this.filtrarProductos();
        alert('Producto eliminado correctamente');
      }
    }
  }

}
