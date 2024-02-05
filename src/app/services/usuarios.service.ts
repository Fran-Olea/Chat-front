import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ITokenInfo, IUser } from '../interfaces/user.interface';
import { inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  urlAPI = environment.urlAPI;

  constructor(public http: HttpClient) {}

  getUsuarios(): Observable<IUser[]> {
    const headers = this.getTokenHeader();
    return this.http.get<IUser[]>(`${this.urlAPI}/Usuario`, { headers: headers });
  }

  getUsuariosId(id: number): Observable<IUser> {
    const headers = this.getTokenHeader();
    return this.http.get<IUser>(`${this.urlAPI}/Usuario/${id}`, { headers: headers });
  }

  addUsuarios(usuario: IUser): Observable<any> {
    const headers = this.getTokenHeader();
    return this.http.post(`${this.urlAPI}/Usuario/hash/nuevousuario`, usuario, { headers: headers });
  }

  updateUsuarios(usuario: IUser): Observable<any> {
    const headers = this.getTokenHeader();
    return this.http.put(`${this.urlAPI}/Usuario/${usuario.id}`, usuario, { headers: headers });
  }


  changePassword(usuario: IUser): Observable<any> {
    const headers = this.getTokenHeader();
    return this.http.put(`${this.urlAPI}/Usuario/cambioPasswordHASH`, usuario, { headers: headers });
  }

 deleteUsuarios(usuario: IUser): Observable<any> {
    const headers = this.getTokenHeader();
    return this.http.delete(`${this.urlAPI}/Usuario/${usuario.id}`, { headers: headers });
  }

  getTokenHeader(): HttpHeaders {
    const user: ITokenInfo = JSON.parse(localStorage.getItem('usuario')!);
    // const user: ITokenInfo = JSON.parse(sessionStorage.getItem('usuario')!);
    const headers = new HttpHeaders({ Authorization: `Bearer ${user.token}` });
    return headers;
  }

  getDataByPk = <T>(controllerPath: string) => {
    // const http = inject(HttpClient);
    
    const route = inject(ActivatedRoute);
    const { pk } = route.snapshot.params;
  
    const prueba = `${environment.urlAPI}/${controllerPath}/${pk}`;
    console.log(prueba);
    // return http.get<T>(`${environment.urlAPI}api/${controllerPath}/${pk}`);

    return this.http.get<T>(`${environment.urlAPI}api/${controllerPath}/${pk}`);

  };

  // getDataByPk = <T>(id: number) => {
  //   // const http = inject(HttpClient);
    
  //   const route = inject(ActivatedRoute);
  //   const { id } = route.snapshot.params;
  
  //   const prueba = `${this.urlAPI}/Usuario/${pk}`;
  //   console.log(prueba);
  //   // return http.get<T>(`${environment.urlAPI}api/${controllerPath}/${pk}`);

  //   return this.http.get<T>(`${this.urlAPI}/${controllerPath}/${pk}`);
  //   // return this.http.get<T>(`${this.urlAPI}/Usuario/${id}`);

  // };


}
