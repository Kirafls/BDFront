import { Component, OnInit } from '@angular/core';

interface Producto {
  id: number;
  nombre: string;
  unidad: string;
  precio: number;
  stock: number;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})


export class VentaComponent implements OnInit {
   productos: Producto[] = [
    { id: 1, nombre: 'Jitomate', unidad: 'KG', precio: 10, stock: 100 },
    { id: 2, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 60 },
    { id: 3, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40 },
    { id: 4, nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200 },
    { id: 5, nombre: 'Jitomate', unidad: 'KG', precio: 10, stock: 100 },
    { id: 6, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 60 },
    { id: 7, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40 },
    { id: 8, nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200 },
    { id: 9, nombre: 'Jitomate', unidad: 'KG', precio: 10, stock: 100 },
    { id: 10, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 60 },
    { id: 11, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40 },
    { id: 12, nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200 },
    { id: 13, nombre: 'Jitomate', unidad: 'KG', precio: 10, stock: 100 },
    { id: 14, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 60 },
    { id: 15, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40 },
    { id: 16, nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200 },
    { id: 17, nombre: 'Jitomate', unidad: 'KG', precio: 10, stock: 100 },
    { id: 18, nombre: 'Cebolla', unidad: 'KG', precio: 15, stock: 60 },
    { id: 19, nombre: 'Leche', unidad: 'LT', precio: 25, stock: 40 },
    { id: 20, nombre: 'Pan', unidad: 'PZ', precio: 5, stock: 200 }
  ];

  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  cantidades: { [key: number]: number } = {};
  carrito: ItemCarrito[] = [];

  ngOnInit() {
    this.productosFiltrados = [...this.productos];
    this.inicializarCantidades();
  }

  inicializarCantidades() {
    this.productos.forEach(producto => {
      this.cantidades[producto.id] = 0;
    });
  }

  filtrarProductos() {
    if (!this.terminoBusqueda.trim()) {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  incrementarCantidad(productoId: number) {
    const producto = this.productos.find(p => p.id === productoId);
    if (producto && this.cantidades[productoId] < producto.stock) {
      this.cantidades[productoId]++;
    }
  }

  decrementarCantidad(productoId: number) {
    if (this.cantidades[productoId] > 0) {
      this.cantidades[productoId]--;
    }
  }

  agregarAlCarrito(producto: Producto) {
    const cantidad = this.cantidades[producto.id];
    if (cantidad > 0) {
      const itemExistente = this.carrito.find(item => item.producto.id === producto.id);
      
      if (itemExistente) {
        itemExistente.cantidad += cantidad;
        itemExistente.subtotal = itemExistente.cantidad * producto.precio;
      } else {
        this.carrito.push({
          producto,
          cantidad,
          subtotal: cantidad * producto.precio
        });
      }
      
      this.cantidades[producto.id] = 0;
    }
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  limpiarCarrito() {
    this.carrito = [];
    this.inicializarCantidades();
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  procesarVenta() {
    if (this.carrito.length > 0) {
      const total = this.calcularTotal();
      alert(`Venta procesada por $${total} MXN`);
      this.limpiarCarrito();
    }
  }

}
