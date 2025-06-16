import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';


interface Venta {
  id_factura: number;
  total: number;
  iva: number;
  cliente: string;
  datos_envio: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  id_compra: number;
  
  punto_venta: string;
  id_vendedor: number;
  fecha: string;
  metodo_pago: string;
}

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reportes-ventas.component.html',
  styleUrls: ['./reportes-ventas.component.css'],

})
export class ReportesVentasComponent implements OnInit {
  ventas: Venta[] = [];
  terminoBusqueda: string = '';
  ventasFiltradas: Venta[] = [];
  loading = true;
  error = '';
cargando: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas(): void {
    this.http.get<Venta[]>('http://localhost:3000/api/facturas')
      .subscribe({
        next: (data) => {
          this.ventas = data;
          this.ventasFiltradas = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al obtener reportes de ventas.';
          this.loading = false;
        }
      });
  }

  filtrarVentas(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.ventasFiltradas = this.ventas.filter(v =>
      v.punto_venta.toLowerCase().includes(termino) ||
      v.id_compra.toString().includes(termino) ||
      v.id_vendedor.toString().includes(termino) ||
      v.metodo_pago.toLowerCase().includes(termino)
    );
  }

  descargarPDF(): void {
    window.open('http://localhost:3000/api/ventas/reporte/pdf', '_blank');
  }
}
