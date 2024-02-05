// import { Component, OnInit } from '@angular/core';
// import { SplitButtonModule } from 'primeng/splitbutton';
// import { Observable } from 'rxjs';
// import { IUser } from 'src/app/interfaces/user.interface';
// import { ActivatedRoute } from '@angular/router';
// import { UsuariosService } from 'src/app/services/usuarios.service';
// @Component({
//   selector: 'app-inicio',
//   templateUrl: './inicio.component.html',
//   styleUrls: ['./inicio.component.css']
// })
// export class InicioComponent implements OnInit {
//   usuario: IUser | undefined; 
//   userId: number | undefined; 
//   constructor(private usuariosService: UsuariosService) {}

//   ngOnInit(): void {}

//   obtenerUsuarioPorId(): void {
//     if (this.userId !== undefined) {
//       this.usuariosService.getUsuariosId(this.userId).subscribe(
//         (usuario: IUser) => {
//           this.usuario = usuario;
//           console.log('Usuario obtenido:', usuario);
//         },
//         (error) => {
//           console.error('Error al obtener usuario:', error);
//         }
//       );
//     }
//   }
// }


import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import 'prismjs';

declare var Prism: any;
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {
  currentSection: string = ''; // Asegúrate de inicializarla con un valor adecuado
  // Esta debería contener el código que quieres mostrar
  codeForClases: string =
    `
public class Connection
{
    public string Id { get; set; }
    public string User { get; set; }
    public string Avatar { get; set; }
    public string Room { get; set; }
}

public class Message
{
    public string User { get; set; }
    public string Text { get; set; }
    public string Avatar { get; set; }
    public string Room { get; set; }
    public int? Id { get; set; }    
    public DateTime Fecha { get; set; }
}

public class ResultadoHash
{
    public string Hash { get; set; }
    public byte[] Salt { get; set; }
}`;
  codeForComponentes: string = '';
  items?: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Backend',
        items: [
          { label: 'resumen', command: () => this.navigateTo('resumen') },
          { label: 'Clases', command: () => this.navigateTo('clases') },
          { label: 'Hub', command: () => this.navigateTo('hub') },
          { label: 'Controladores', command: () => this.navigateTo('controladores') },
          { label: 'Servicios', command: () => this.navigateTo('servicios') }
        ]
      },
      {
        label: 'Frontend',
        items: [
          { label: 'Componentes', command: () => this.navigateTo('componentes') },
          { label: 'Servicios', command: () => this.navigateTo('serviciosFront') },
          { label: 'Directivas', command: () => this.navigateTo('directivas') },
          { label: 'Módulos', command: () => this.navigateTo('modulos') }
        ]
      },
      {
        label: 'Instalacion',
        items: [
          { label: 'Angular-instalación', command: () => this.navigateTo('Angular-instalación') },
          { label: 'asp core y signalR', command: () => this.navigateTo('Asp core y signalR') },
        ]
      },
      {
        label: 'Base de datos',
        items: [
          { label: 'Tablas', command: () => this.navigateTo('componentes') },
        ]
      },
      {
        label: 'Presentacion',
        items: [
          { label: 'signalR', command: () => this.navigateTo('signalR') },
          { label: 'Angular', command: () => this.navigateTo('Angular') },
          { label: 'Seguridad', command: () => this.navigateTo('Seguridad') },
          { label: 'chatPresentation', command: () => this.navigateTo('chatPresentation') },
        ]
      },
    ];
  }

  ngAfterViewInit() {
    Prism.highlightAll();
  }

  navigateTo(section: string) {
    // Implementa la lógica de navegación aquí, como desplazarse a un ancla o cambiar un componente de visualización
    this.currentSection = section;
  }

  // Función para copiar el código de ejemplo
  copyCode(code: string) {
    navigator.clipboard.writeText(code).then().catch(e => console.error(e));
    alert("Código copiado al portapapeles!");
  }
}
