import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NuserService {
  private bduser= 'http://localhost:3000/bd/nuser';
  constructor(private http: HttpClient) { }
    
  sendUser(user: string,contra:string):Observable<any>{
    return this.http.post(this.bduser,{user,contra});
  }
}
