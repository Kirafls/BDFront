import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CclienteService {
      private tienda= 'http://localhost:3000/tienda/crearcliente';
      constructor(private http: HttpClient) { }

      crearCliente(nombre: string,apellidos:string,rfc: string ):Observable<any>{
          return this.http.post(this.tienda,{nombre,apellidos,rfc});
      }
}
