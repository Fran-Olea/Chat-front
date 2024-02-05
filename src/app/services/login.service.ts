import {  Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; // Importa Subject de RxJS
import { environment } from 'src/environments/environment';
import { ITokenInfo, IUser } from '../interfaces/user.interface';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlAPI = environment.urlAPI;

  // Crea un Subject para el evento de inicio de sesión exitoso
  private loginSuccessSubject = new Subject<void>();

  // Expone el Subject como un observable
  public onLoginSuccess = this.loginSuccessSubject.asObservable();

  private currentUser: IUser | null = null;

  currentUser2: IUser | null = null;

  private currentRoom: string = '';

  private connectedUsers: IUser[] = [];

  private isPageReloading = false;

//  // Hook para detectar el cierre de la ventana del navegador
//  @HostListener('window:beforeunload', ['$event'])
//  beforeunloadHandler(event: Event): void {
//    this.disconnectUser();
//  }


 // canal de comunicación entre las ventanas
 private broadcastChannel = new BroadcastChannel('sessionChannel');
 

  constructor(private http: HttpClient, private router: Router) 
  {

    // PARA QUE CIERRE SESION AL CERRAR VENTANA                    OJOOOOO VENTANAAAAA
    window.addEventListener('beforeunload', () => this.beforeunloadHandler()); 

    // window.addEventListener('load', () => this.beforeunloadHandler());  

//DESDE AQUI



//HASTA AQUI
    //   window.addEventListener('message', (event) => this.messageHandler(event));
    //   // Notificar a otras ventanas al cargar la aplicación
    // this.postMessageToOtherWindows('loginStatus', 'loggedIn');
  }
  
  login(usuario: IUser): Observable<ITokenInfo> {
    return this.http.post<ITokenInfo>(this.urlAPI + '/Usuario/login', usuario)
      .pipe(
        // Utiliza el operador tap para emitir el evento después de un inicio de sesión exitoso
        tap((tokenInfo: ITokenInfo) => {
          // Almacena el usuario en el servicio después de un inicio de sesión exitoso
        
          this.currentUser = { nombre: tokenInfo.nombre, email: usuario.email, token: tokenInfo.token, rol: tokenInfo.rol };
          this.loginSuccessSubject.next();

        })
      );
  }

// updateSala(sala: string){
//   this.currentRoom = sala;
  
// }
// getSala(): string {
  
//   return this.currentRoom;
  
// }



  // logout(): void {
  //   this.currentUser = null;
  //   localStorage.removeItem('usuario');
  // }

// En tu servicio Angular (LoginService)
logout(): void {
  this.disconnectUserByEmail().subscribe(
    response => {
      console.log(`Usuario desconectado correctamente.`);
      this.currentUser = null;
      localStorage.removeItem('usuario');

      this.getConnectedUsers().subscribe((currentUsers: IUser[]) => {
        const updatedUsers = currentUsers.filter(user => user.email !== this.getUserEmail());

        this.updateConnectedUsers(updatedUsers);

      });
    },
    error => {
      console.error(`Error al desconectar al usuario.`, error);

      this.currentUser = null;
      localStorage.removeItem('usuario');

    }
  );
}


// metodo para actualizar la lista de usuarios conectados
updateConnectedUsers(users: IUser[]): void {
  this.connectedUsers = users;
}

  

  getUserLogged(): IUser | null {
    console.log('Usuario actualmente logeado:', this.currentUser);
    return this.currentUser;
    
  }

 

  //MOSTRAR USUARIOS CONECTADOS QUE CONECTA AL USUARIOS CONTROLLER DEL BACK Y AL CHAT.COMPONENT.TS
  getConnectedUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.urlAPI + '/Usuario/connectedUsers');
  }
  
    // Método para desconectar al usuario por correo electrónico
    disconnectUserByEmail(): Observable<any> {
      const userEmail = this.getUserEmail(); // Obtén el correo electrónico del usuario
      if (userEmail) {
        const url = `${this.urlAPI}/usuario/disconnectUser?userEmail=${userEmail}`;
        return this.http.delete(url, { responseType: 'text' });
      } else {
        console.error("No se pudo obtener el correo electrónico del usuario.");
        return new Observable(); // O regresa un observable con error según tus necesidades
      }
    }


// Método para actualizar el rol de un usuario por correo electrónico
updateUserRoleByEmail(newRole: string): Observable<any> {
  const userEmail = this.getUserEmail(); // Obtén el correo electrónico del usuario
  if (userEmail) {
    const url = `${this.urlAPI}/usuario/updateUserRole?userEmail=${userEmail}&newRole=${newRole}`;
    return this.http.put(url, null, { responseType: 'text' });
  } else {
    console.error("No se pudo obtener el correo electrónico del usuario.");
    return new Observable(); // O regresa un observable con error según tus necesidades
  }
}



  // Método para desconectar al usuario antes de cerrar la ventana
  // private beforeunloadHandler(): void {
  //   const userEmail = this.getUserEmail();

  //   if (userEmail) {
  //     this.disconnectUserByEmail().subscribe(
  //       response => {
  //         console.log(`Usuario con correo electrónico ${userEmail} desconectado automáticamente.`);
  //       },
  //       error => {
  //         console.error(`Error al desconectar automáticamente al usuario con correo electrónico ${userEmail}.`, error);
  //       }
  //     );
  //   } else {
  //     console.error("No se pudo obtener el correo electrónico del usuario para desconectar automáticamente.");
  //   }
  // }

   // Método para desconectar al usuario antes de cerrar la ventana
   private beforeunloadHandler(): void {
    // Llama al método logout que ya tiene la lógica para desconectar y otras acciones de cierre de sesión
    this.logout();
    // this.postMessageToOtherWindows('loginStatus', 'loggingOut'); 
   }



    // private messageHandler(event: MessageEvent): void {
    //   // Manejar mensajes recibidos de otras ventanas
    //   if (event.data && event.data.type === 'loginStatus') {
    //     if (event.data.data === 'loggingOut') {
    //       // Ejecutar lógica de logout
    //       this.logout();
    //     }
    //   }
    // }





  getUserEmail(): string | null {
    return this.currentUser ? this.currentUser.email : null;
  }

  getUserRole(): string | null {
    return this.currentUser && this.currentUser.rol ? this.currentUser.rol : null;
  }


}
