import { Component, OnInit } from '@angular/core';
import { ProductosService, Producto } from '../../services/productos.service';
import { VentasService, VentaRequest, ItemVenta } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-venta',
  
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  
})
export class VentaComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  cantidades: { [key: number]: number } = {};
  carrito: ItemCarrito[] = [];
  cargando: boolean = false;
  procesandoVenta: boolean = false;
  error: string = '';
  metodoPago: string = 'efectivo';
  ultimaVentaId: number | null = null;
  ticketGenerado: string = '';
  mostrarTicket: boolean = false;

  constructor(
    private productosService: ProductosService,
    private ventasService: VentasService
  ) { }

  ngOnInit() {
    this.cargarProductos();
  }

  // Cargar productos desde la API (solo productos activos)
  cargarProductos() {
    this.cargando = true;
    this.error = '';
    
    this.productosService.getProductosActivos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = [...productos];
        this.inicializarCantidades();
        this.cargando = false;
      },
      error: (error) => {
        this.error = error;
        this.cargando = false;
        console.error('Error al cargar productos:', error);
      }
    });
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
      this.productosService.buscarProductos(this.terminoBusqueda).subscribe({
        next: (productos) => {
          this.productosFiltrados = productos.filter(p => p.activo);
        },
        error: (error) => {
          console.error('Error al buscar productos:', error);
          this.productosFiltrados = this.productos.filter(producto =>
            producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
            (producto.categoria && producto.categoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase()))
          );
        }
      });
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
      const cantidadEnCarrito = this.getCantidadEnCarrito(producto.id);
      const cantidadTotal = cantidadEnCarrito + cantidad;
      
      if (cantidadTotal > producto.stock) {
        alert(`No hay suficiente stock. Stock disponible: ${producto.stock}, en carrito: ${cantidadEnCarrito}`);
        return;
      }

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

  getCantidadEnCarrito(productoId: number): number {
    const item = this.carrito.find(item => item.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  getStockDisponible(producto: Producto): number {
    const cantidadEnCarrito = this.getCantidadEnCarrito(producto.id);
    return producto.stock - cantidadEnCarrito;
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  limpiarCarrito() {
    this.carrito = [];
    this.inicializarCantidades();
    this.mostrarTicket = false;
    this.ticketGenerado = '';
    this.ultimaVentaId = null;
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  procesarVenta() {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Verificar stock antes de procesar
    const stockInsuficiente = this.carrito.find(item => 
      item.cantidad > item.producto.stock
    );
    
    if (stockInsuficiente) {
      alert(`Stock insuficiente para ${stockInsuficiente.producto.nombre}`);
      return;
    }

    const total = this.calcularTotal();
    
    if (!confirm(`¿Confirmar venta por $${total.toFixed(2)} MXN?`)) {
      return;
    }

    this.procesandoVenta = true;
    this.error = '';

    // Preparar datos para la API
    const itemsVenta: ItemVenta[] = this.carrito.map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      subtotal: item.subtotal
    }));

    const ventaRequest: VentaRequest = {
      items: itemsVenta,
      total: total,
      metodoPago: this.metodoPago
    };

    // Procesar venta en el backend
    this.ventasService.procesarVenta(ventaRequest).subscribe({
      next: (response) => {
        this.procesandoVenta = false;
        this.ultimaVentaId = response.ventaId;
        
        alert(`Venta procesada correctamente por $${response.total.toFixed(2)} MXN\nTicket No: ${response.ventaId}`);
        
        // Limpiar carrito y recargar productos
        this.limpiarCarrito();
        this.cargarProductos();
        
        // Generar ticket automáticamente
        this.generarTicket(response.ventaId);
      },
      error: (error) => {
        this.procesandoVenta = false;
        this.error = error;
        alert(`Error al procesar la venta: ${error}`);
      }
    });
  }

  generarTicket(ventaId?: number) {
    const id = ventaId || this.ultimaVentaId;
    if (!id) {
      alert('No hay venta para generar ticket');
      return;
    }

    this.ventasService.generarTicket(id).subscribe({
      next: (response) => {
        this.ticketGenerado = response.ticket;
        this.mostrarTicket = true;
      },
      error: (error) => {
        alert(`Error al generar ticket: ${error}`);
      }
    });
  }

  imprimirTicket() {
    if (!this.ticketGenerado) return;
    
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Ticket de Venta</title>
            <style>
              body { font-family: monospace; font-size: 12px; margin: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${this.ticketGenerado}</pre>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
    }
  }

  cerrarTicket() {
    this.mostrarTicket = false;
    this.ticketGenerado = '';
  }

  reintentar() {
    this.cargarProductos();
  }

  tieneStockBajo(producto: Producto): boolean {
    return producto.stock < 10;
  }

  estaAgotado(producto: Producto): boolean {
    return this.getStockDisponible(producto) <= 0;
  }
}