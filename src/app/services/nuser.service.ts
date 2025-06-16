import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NuserService {
  private apiUrl = 'http://localhost:3000/tienda'; // Ajusta esta URL
  private apiUrl2 = 'http://localhost:3000/tienda'; // Ajusta esta URL si es necesario
  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`);
  }

  actualizarEmpleado(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/empleados/${id}`, datos);
  }

cambiarEstado(id: number, estado: string): Observable<any> {
  // Asegúrate que el estado sea string y esté entre los valores permitidos
  const estadoValidado = estado.toString();
  if (!['0', '1', '2'].includes(estadoValidado)) {
    return throwError(() => new Error(`Valor de permiso no válido. Use 0, 1 o 2`));
  }

  console.log(`Enviando estado:`, { id, estado: estadoValidado });

  return this.http.patch(`${this.apiUrl}/empleados/estado`, 
    { id, estado: estadoValidado },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  ).pipe(
    catchError(error => {
      console.error('Error en cambiarEstado:', error);
      return throwError(() => new Error(
        error.error?.error || 
        error.error?.message || 
        'Error al cambiar el estado'
      ));
    })
  );
}
  crearEmpleado(datos: any): Observable<any> {
    console.log('Datos a enviar:', datos);
    return this.http.post(`${this.apiUrl}/empleados/nuevo`, datos);
  }
} 
