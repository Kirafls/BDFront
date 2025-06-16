import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SreportesService {

   private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu API

  constructor(private http: HttpClient) { }

  getventasxdia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/venta/xdia`);
  }

  getproductosmasvendidos(): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/venta/masvendido`).pipe(
    map((productos: any[]) => productos.map(p => ({
      id_producto: p.id_producto,
      nombre: p.nombre_producto || 'Sin nombre',
      total_vendido: p.total_vendido || 0,
      ingresos_totales: p.ingresos_totales || 0,
      veces_vendido: p.veces_vendido || 0
    })))
  );
  }
  
  getAllVentasConDetalles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/venta/reporte`).pipe(
      catchError(error => {
        console.error('Error obteniendo ventas:', error);
        return of([]);
      })
    );
  }

  
}
