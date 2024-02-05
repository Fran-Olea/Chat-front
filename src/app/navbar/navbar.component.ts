import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [MessageService] 

})
export class NavbarComponent implements OnInit {


  messages: any[] = [];  

  userEmail: string | null = null;
  userRol: string | null = null;

  constructor(private loginService: LoginService, 
    private router: Router,
    private messageService : MessageService
    ) 
    {}

  ngOnInit(): void {

  const storedUser = JSON.parse(localStorage.getItem('usuario') || 'null');

  if (storedUser) {
    this.userEmail = storedUser.email;
    this.userRol = storedUser.rol;
  }

  this.loginService.onLoginSuccess.subscribe(() => {
    this.userEmail = this.loginService.getUserEmail();
    this.userRol = this.loginService.getUserRole();
  });
}


  logout(): void {
    this.loginService.logout();
    this.userEmail = null;
    this.userRol = null;
    localStorage.removeItem('usuario');
    this.messageService.add({
      severity: 'success',
      summary: 'Cerrar Sesión',
      detail: 'Se cerró la sesión exitosamente.'
    });

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }

    // OJO SE ESTA SUANDO EN EL LOGIN SERVICE para desconectar usuario de la lista del backend, metodo que se ejecuta cuando deseas desconectar al usuario
    disconnectUser(): void {
      this.loginService.disconnectUserByEmail().subscribe(
        response => {
          console.log(`Usuario desconectado correctamente.`);
          // Puedes realizar acciones adicionales después de desconectar al usuario si es necesario
        },
        error => {
          console.error(`Error al desconectar al usuario.`, error);
          // Maneja el error según tus necesidades
        }
      );
    }
  
  login(): void {
    this.router.navigate(['/login']);
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

  perfil(): void {
    this.router.navigate(['/perfil']);
  }

  toggleSidebar() {
    const contenedorBotones = document.getElementById("contenedor-botones")!;
    const contenedorContenido = document.getElementById("contenedor-contenido")!;

    if (contenedorBotones.style.width === "200px") {
      contenedorBotones.style.width = "0";
      contenedorContenido.style.marginLeft = "0px";
    } else {
      contenedorBotones.style.width = "200px";
      // contenedorContenido.style.marginLeft = "50px";
    }
  }

}
