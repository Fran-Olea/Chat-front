import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { StorageHelper } from './localstorage.service';
import { SignalRService } from './signalr.service';
import { IArchivoInfo } from '../interfaces/arhivos.interface';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  private urlAPI = 'https://localhost:7217/api';
  userData: IUser;
  salaSeleccionada: string | null = null;

  constructor(private http: HttpClient, public signalRService: SignalRService) {
    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };
  }

  obtenerArchivos(): Observable<IArchivoInfo[]> {
    const url = `${this.urlAPI}/Archivos/todosLosArchivos`;
    return this.http.get<IArchivoInfo[]>(url);
  }

  obtenerArchivosPorTipo(tipoArchivo: string): Observable<IArchivoInfo[]> {
    const url = `${this.urlAPI}/Archivos/archivosPorTipo/${tipoArchivo}`;
    return this.http.get<IArchivoInfo[]>(url);
  }

  borrarTodosLosArchivos(): Observable<void> {
    const url = `${this.urlAPI}/Archivos/borrarArchivos`;
    return this.http.delete<void>(url);
  }
  
    // Método para borrar un archivo específico
    borrarArchivo(archivo: IArchivoInfo): Observable<void> {
      const url = `${this.urlAPI}/Archivos/borrarArchivo/${archivo.nombre}`;
      return this.http.delete<void>(url);
    }

    
  
//+ URL
  // convertirArchivoADatosUrl(archivo: IArchivoInfo): IArchivoInfo {
  //   if (!archivo.tipoArchivo) {
  //     console.error('Tipo de archivo es:', archivo.tipoArchivo);
  //     return archivo;
  //   }

  //   return {
  //     ...archivo,
  //     url: `${this.urlAPI}/uploads/${archivo.nombre}`, 
  //   };
  // }



  // convertirArchivoADatosUrl(archivo: IArchivoInfo): IArchivoInfo {
  //   if (!archivo.tipoArchivo) {
  //     console.error('Tipo de archivo es:', archivo.tipoArchivo);
  //     return archivo;
  //   }

  //   const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
  //     const binary = new Uint8Array(arrayBuffer);
  //     const bytes = binary.reduce((bytes, byte) => bytes + String.fromCharCode(byte), '');
  //     return btoa(bytes);
  //   };

  //   return {
  //     ...archivo,
  //     url: `data:image/${archivo.tipoArchivo.toLowerCase()};base64,${arrayBufferToBase64(archivo.tipoArchivo)}`,
  //   };
  // }

  // editarNombreArchivo(id: number, nuevoNombre: string): Observable<IArchivoInfo[]> {
  //   const url = `${this.urlAPI}/api/archivos/${id}`;
  //   return this.http.put<IArchivoInfo[]>(url, { nuevoNombre });
  // }

  // eliminarArchivo(id: number): Observable<void> {
  //   const url = `${this.urlAPI}/api/archivos/${id}`;
  //   return this.http.delete<void>(url);
  // }

 

  // getSalasDisponibles(): Observable<string[]> {
  //   const url = `${this.urlAPI}/Archivos/salas-disponibles`;
  //   return this.http.get<string[]>(url);
  // }
}