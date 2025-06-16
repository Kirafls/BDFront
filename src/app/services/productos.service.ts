// productos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
  unidad: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
  activo: boolean;
}

export interface ApiResponse {
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  generarPDFFactura(Id_factura: any) {
    return this.http.get(`http://localhost/mi_api/api/pdf_factura.php?id_factura=${Id_factura}`, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  private apiUrl = 'http://localhost/mi_api/api/ventas.php';

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un producto por ID
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear nuevo producto
  crearProducto(producto: Omit<Producto, 'id'>): Observable<Producto & ApiResponse> {
    return this.http.post<Producto & ApiResponse>(this.apiUrl, producto)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar producto
  actualizarProducto(id: number, producto: Omit<Producto, 'id'>): Observable<Producto & ApiResponse> {
    return this.http.put<Producto & ApiResponse>(`${this.apiUrl}/${id}`, producto)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar producto
  eliminarProducto(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cambiar estado del producto (activo/inactivo)
  cambiarEstadoProducto(id: number, activo: boolean): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}/estado`, { activo })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener productos activos
  getProductosActivos(): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => productos.filter(p => p.activo))
    );
  }

  // productos.service.ts

getReporteVentas() {
  return this.http.get<any[]>(`${this.apiUrl}/reportes.php`);
}

getVentasReporte() {
  return this.http.get<any[]>(`${this.apiUrl}/reporte_ventas.php`);
}



  // Obtener productos con stock bajo
  getProductosStockBajo(limite: number = 10): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => productos.filter(p => p.stock < limite && p.activo))
    );
  }

  // Buscar productos por nombre o categoría
  buscarProductos(termino: string): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => productos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(termino.toLowerCase()))
      ))
    );
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
          errorMessage = 'Datos inválidos. Verifica la información enviada.';
          break;
        case 404:
          errorMessage = 'Producto no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta nuevamente.';
          break;
        default:
          errorMessage = error.error?.error || `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en ProductosService:', error);
    return throwError(() => errorMessage);
  }
}