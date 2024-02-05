import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ITokenInfo, IUser } from '../interfaces/user.interface';

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
  addUsuarios(usuario: IUser): Observable<any> {
    const headers = this.getTokenHeader();
    return this.http.post(`${this.urlAPI}/Usuario/hash/nuevousuario`, usuario, { headers: headers });
  }

  // updateEquipo(usuario: IUser): Observable<any> {
  //   const headers = this.getTokenHeader();
  //   return this.http.put(`${this.urlAPI}/Usuario/${usuario.id}`, usuario, { headers: headers });
  // }

  // deleteEquipo(id: number): Observable<any> {
  //   const headers = this.getTokenHeader();
  //   return this.http.delete(`${this.urlAPI}/Usuario/${id}`, { headers: headers });
  // }

//   deleteEquipoJugadores(id: number): Observable<any> {
//     const headers = this.getTokenHeader();
//     return this.http.delete(`${this.urlAPI}/Usuarios/eliminarequipoconJugadores/${id}`, { headers: headers });
//   }

  getTokenHeader(): HttpHeaders {
    const user: ITokenInfo = JSON.parse(localStorage.getItem('usuario')!);
    // const user: ITokenInfo = JSON.parse(sessionStorage.getItem('usuario')!);
    const headers = new HttpHeaders({ Authorization: `Bearer ${user.token}` });
    return headers;
  }
}
