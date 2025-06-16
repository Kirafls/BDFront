import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ItemVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaRequest {
  items: ItemVenta[];
  total: number;
  metodoPago?: string;
}

export interface VentaResponse {
  ventaId: number;
  message: string;
  fecha: string;
  total: number;
  metodoPago: string;
}

export interface DetalleVenta {
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  nombreProducto: string;
  unidad: string;
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  metodoPago: string;
  detalles?: DetalleVenta[];
}

export interface TicketResponse {
  ticket: string;
  venta: Venta;
}

export interface ReporteVentas {
  resumen: {
    totalVentas: number;
    totalIngresos: number;
    promedioVenta: number;
  };
  ventas: Venta[];
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost/mi_api/api/ventas.php';


  constructor(private http: HttpClient) { }

  // Procesar venta
  procesarVenta(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.apiUrl, venta)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todas las ventas
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una venta por ID
  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generar ticket de venta
  generarTicket(ventaId: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.apiUrl}/${ventaId}/ticket`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener reporte de ventas por fecha
  getReporteVentas(fecha: string): Observable<ReporteVentas> {
    return this.http.get<ReporteVentas>(`${this.apiUrl}/reporte/${fecha}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getVentasReporte() {
  return this.http.get<any[]>(`${this.apiUrl}/reporte_ventas.php`);
}

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.error || 'Datos inválidos para procesar la venta.';
          break;
        case 404:
          errorMessage = 'Venta no encontrada.';
          break;
        case 500:
          errorMessage = error.error?.error || 'Error interno del servidor. Intenta nuevamente.';
          break;
        default:
          errorMessage = error.error?.error || `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en VentasService:', error);
    return throwError(() => errorMessage);
  }
}