// sidebar.component.ts

import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/services/login.service';
import { ChatComponent } from '../PruebaChat/chat.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();
  sidebarWidth: string = '200px';

  connectedUsers: IUser[] = [];

  private subscription: Subscription = new Subscription()

  userData: IUser;

  salaSeleccionada: string = ''; 
  salaSeleccionada2: string = ''; 

  label: string = '';

  currentUser2: IUser;


  constructor(private router: Router,
    private loginService: LoginService,

    ) 
    {
      this.userData = {
        ...StorageHelper.getItem<IUser>('usuario')!,
        avatar: StorageHelper.getAvatar()!,
      };
      
      this.salaSeleccionada = this.userData.rol!;

      this.currentUser2 = this.loginService.currentUser2!;
    }


  ngOnInit(): void {

        // this.prueba();

    // this.label = this.chatComponent.getRoomName2();


     // Realiza la primera llamada al servicio
     this.mostrarUsuariosDeListaCreada();


    // Suscribe al evento de inicio de sesión para actualizar la lista de usuarios
    this.loginService.onLoginSuccess.subscribe(() => {
      this.mostrarUsuariosDeListaCreada();
    });

    //  Configura un intervalo para actualizar la lista cada X segundos
     const intervalTime = 5000; // 5000 milisegundos = 5 segundos
     this.subscription = interval(intervalTime).subscribe(() => {
       this.mostrarUsuariosDeListaCreada();
     });
 

  }


  ngOnDestroy(): void {
    // Limpia la suscripción al destruir el componente
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private mostrarUsuariosDeListaCreada() {
    this.loginService.getConnectedUsers().subscribe(
      users => {
        this.connectedUsers = users;
      },
      error => {
        console.error('Error obteniendo usuarios conectados', error);
      }
    );
  }



  
  toggleSidebar() {
    this.sidebarWidth = this.sidebarWidth === '200px' ? '0' : '200px';
    this.toggle.emit();
  }


  inicio(): void {
    this.router.navigate(['/inicio']);
  }

  chat(): void {
    this.router.navigate(['/chat']);
  }

  registrar2(): void {
    this.router.navigate(['/registro']);
  }

  historial(): void {
    this.router.navigate(['/historial']);
  }


  // prueba(): void {
  //   console.log('Entrando al método prueba');
  //   const label: string = this.chatComponent.getRoomName();
  //   console.log(`Etiqueta de la sala: ${label}`);
  //   console.log('Saliendo del método prueba');
  // }


  getLabelForSala(sala: string): string {
    switch (sala) {
      case 'admin':
        return 'Sala conjunta';
      case 'Grupo 1':
        return 'Sala 1';
        case 'Grupo 2':
          return 'Sala 2';
          case 'Grupo 3':
            return 'Sala 3';
            case 'Grupo 4':
              return 'Sala 4';
              case 'Grupo 5':
                return 'Sala 5';
                case 'Grupo 6':
                  return 'Sala 6';
      default:
        return sala;
    }
  }



  archivos(): void {
    this.router.navigate(['/archivos']);
  }

}
