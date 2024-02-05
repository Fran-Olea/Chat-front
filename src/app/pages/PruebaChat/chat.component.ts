import { Component, OnInit, AfterContentInit, NgModule, ChangeDetectorRef, ElementRef, ViewChild  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { IMessage } from 'src/app/interfaces/message.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserChatService } from 'src/app/services/UserChat.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/services/login.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Subscription, interval } from 'rxjs';
import { IMessage2 } from 'src/app/interfaces/message2.interface';
import { FileDataService } from 'src/app/services/fileData.Service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService] 
})
export class ChatComponent implements OnInit, AfterContentInit {
  lastImageName: string | undefined;

  lastImageUrl: string | undefined;
  currentUser: IUser;
  connectedUsers: IUser[] = [];
  messages: any[] = [];  
  usuariosConectados: any[] = [];
  private subscription: Subscription = new Subscription()
  usuarios: IUser[] = [];
  userData: IUser;
  mensajes: { usuario: string; mensaje: string;}[] = [];
  // mensajes: IMessage[] = [];
  mensajes2: { usuario: string; mensaje: string;}[] = [];
  allMessages: { usuario: string; mensaje: string; }[] = [];
  mensajeNuevo: string = '';
  mensajeNuevo2: string = '';
  usuarioNuevo: string = '';
  salaSeleccionada: string = ''; 
  salaSeleccionada2: string = ''; 
  avatarUrl: string = '';  

  
  usuarioActual: any;

  get connected() {
    return this.signalrService.connected;
  }

  constructor(
    private signalrService: SignalRService,
    private loginService: LoginService,
    private router: Router,
    private usuariosService: UsuariosService,
    private userChatService: UserChatService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fileDataService: FileDataService

  ){
    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };

    this.salaSeleccionada = this.userData.rol!;

    if (this.connectedUsers.length > 0) {
      this.salaSeleccionada2 = this.connectedUsers[0].rol!;
      console.log(`SALASELECCIONADA2:`, this.salaSeleccionada2)

    };

    this.currentUser = this.loginService.getUserLogged()!;
  
  }



    ngOnInit(): void {

      this.getUsuarios();
      this.editarUsuario(this.usuarioActual);

      
      this.signalrService.connectUser();

    // Realiza la primera llamada al servicio
    this.fetchConnectedUsers();

    // Configura un intervalo para actualizar la lista cada X segundos
    const intervalTime = 5000; // 5000 milisegundos = 5 segundos
    this.subscription = interval(intervalTime).subscribe(() => {
      this.fetchConnectedUsers();
    });

          // suscribirse a los cambios en la lista de usuarios conectados
          this.userChatService.usuariosConectados$.subscribe((usuarios) => {
            this.usuarios = usuarios;
            console.log('Usuarios conectados al CHAT:', usuarios);
          });

        this.usuariosService.getUsuarios().subscribe({
          next: (data) => {
            this.usuarios = data;

        // Actualiza la lista de usuarios conectados en el servicio
      // this.userChatService.actualizarUsuariosConectados(data);


// LOCAL STORAGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

this.mensajes = StorageHelper.obtenerMensajes() || [];  // TODO: HACER UNA FUNCION PARA GUARDAR LOS MENSAJES EN EL LOCAL STORAGE


    // BORRAR AVATAR PARA VER EL DE POR DEFECTO
    // StorageHelper.removeAvatar();

  // USUARIOS!!!! Imprime el usuario actualmente logeado en el servicio
  // const currentUser = this.loginService.getUserLogged();
  // console.log('Usuario actualmente logeado en el componente:', this.currentUser);  // Marcar cambios después de actualizar la lista de usuarios
  // this.cdr.detectChanges();
          },
          error: (err) => {
            alert('Error en el acceso a datos');
          }
        });
        console.log('Datos del usuario:', this.userData);
    }

  ngAfterContentInit(): void {
    this.signalrService.connect();

    //para los sonidos
   // this.sonidoAleatorioConectar();

    this.getMessages();
    // this.getMessages2();

  }

  ngOnDestroy(): void {
    // Limpia la suscripción al destruir el componente
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchConnectedUsers() {
    this.loginService.getConnectedUsers().subscribe(
      users => {
        this.connectedUsers = users;
      },
      error => {
        console.error('Error obteniendo usuarios conectados', error);
      }
    );
  }
  
  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     this.fileDataService.addImage(imageUrl);
  //   }
  // }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     this.fileDataService.addImage(imageUrl);
  
  //     // genera mensaje para el chat con enlace de descarga
  //     const message: IMessage = {
  //       user: `${this.currentUser.nombre} `,
  //       // text: 'Imagen adjunta',
  //       // text: `<a href="${imageUrl}" download="archivo_descargado" >Descargar archivo</a>`,
  //       text: `<a href="${imageUrl}" download="" >Descargar archivo</a>`,
  //       avatar: '',
  //       room: this.currentUser.rol!,
  //       file: imageUrl, // Cambiar para que contenga la URL de la imagen
  //       id: this.currentUser.id,
  //     };
  
  //     // Llamar al método sendMessage para enviar el mensaje al chat
  //     this.signalrService.sendMessage(message);
  
  //     console.log('Imagen seleccionada y enviada al chat:', message); // Agrega este console.log
  //   }
  // }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileDataService.uploadFile(file).subscribe(
        response => {
          console.log('Archivo enviado correctamente:', response);
          const fileUrl = response.fileUrl;
        const fileName = file.name;

      const message: IMessage = {
        user: `${this.currentUser.nombre}`,
        // text: `<a href="${fileUrl}" download="Archivo" target="_blank">Descargar archivo</a>`,
        text: `<a href="${fileUrl}" download="${fileName}" target="_blank">${fileName}</a>`,
        avatar: '',
        room: this.currentUser.rol!,
        file: fileUrl, 
        id: this.currentUser.id,
      };
      StorageHelper.guardarMensaje([{ usuario: `${this.currentUser.nombre}`, mensaje: `<a href="${fileUrl}" download="${fileName}" target="_blank">${fileName}</a>` }]);

            this.signalrService.sendMessage(message);
        },
        error => {
          console.error('Error enviando archivo:', error);
        }
      );
    }
  }

// #region pruebas imagen chat
// onFileSelected(event: any): void {
//   const file: File = event.target.files[0];
//   if (file) {
//     this.fileDataService.uploadFile(file).subscribe(
//       response => {
//         console.log('Archivo enviado correctamente:', response);
//         const fileUrl = response.fileUrl;
//         const fileName = file.name;
//         let messageText: string;
        
//     // Verificar el tipo de archivo
// // if (this.isImageFile(file.type)) {
//   if (fileUrl) {
// messageText = `<img src="${fileUrl}" alt="${fileName}"  class="img-chat" />`;
// } else {
// messageText = `<a href="${fileUrl}" download="${fileName}" target="_blank">${fileName}</a>`;
// }
        
//         const message: IMessage = {
//           user: `${this.currentUser.nombre}`,
//           text: messageText,
//           avatar: '',
//           room: this.currentUser.rol!,
//           file: fileUrl,
//           id: this.currentUser.id,
//         };
        
//         this.signalrService.sendMessage(message);
//       },
//       error => {
//         console.error('Error enviando archivo:', error);
//       }
//     );
//   }
// }


isImageFile(fileType: string): boolean {
  return fileType.startsWith('image/');
}


// isImageFile(fileType?: string | File): boolean {
//   if (typeof fileType === 'string') {
//     return fileType.startsWith('image/');
//   }

//   return fileType!.type.startsWith('image/');
// }
//#endregion




  //   sendMessage({text,file}: Omit<IMessage, 'user' | 'avatar' | 'room'>) {
  //     if (( text.trim() !== '' || file) && this.currentUser && this.currentUser.nombre) {
  //     const texto = `${this.currentUser.nombre}: ${text}`;
  //     const message: IMessage = {
  //       user: `${this.currentUser.nombre} `,
  //       text: text,
  //       avatar: '',
  //       room: this.currentUser.rol!, 
  //       file: file,
  //       id: this.currentUser.id,
                
  //     };
  //         // this.mensajes.push({ usuario: this.userData.nombre, mensaje: text });
  //        StorageHelper.guardarMensaje([{ usuario: this.currentUser.nombre, mensaje: text }]);
      
  //     this.signalrService.sendMessage(message);
  //     // this.mensajes.push({ usuario: this.userData.nombre, mensaje: this.mensajeNuevo });
  //       console.log( message);
  //     this.mensajeNuevo = '';
  //   }
  // }

  sendMessage({text,file}: Omit<IMessage, 'user' | 'avatar' | 'room'>) {
    if (( text.trim() !== '' || file) && this.currentUser && this.currentUser.nombre) {
    const texto = `${this.currentUser.nombre}: ${text}`;
    const message: IMessage = {
      user: `${this.currentUser.nombre}`,
      text: text,
      avatar: '',
      // room: this.salaSeleccionada, 
      room: this.currentUser.rol!, 

      file: file,
      id: this.currentUser.id,
              
    };
        // this.mensajes.push({ usuario: this.userData.nombre, mensaje: text });
       StorageHelper.guardarMensaje([{ usuario: this.currentUser.nombre, mensaje: text }]);
    
    this.signalrService.sendMessage(message);
    // this.mensajes.push({ usuario: this.userData.nombre, mensaje: this.mensajeNuevo });
      console.log( message);
    this.mensajeNuevo = '';
  }
}
  
  


 //#region   GET FUNCIONAL MENSAJES CHAT

 getMessages() {
  this.signalrService.messageSubscription.subscribe({
    next: (message: IMessage) => {
      const usuario = message.user.trim();
      let mensaje = message.text;
      const file = message.file;
      console.log('Mensaje recibido en chat.component.ts:', message)
      if (usuario === 'Sistema') {
        this.messageService.add({
          // severity: 'success',
          // severity: 'info',
          severity: 'warn',
          // severity: 'error',
          summary: 'Advertencia',
          detail: message.text,
        });
      }
      if (usuario === 'Host') {
        this.messageService.add({
          severity: 'success',
          // severity: 'info',
          // severity: 'warn',
          // severity: 'error',
          summary: 'Sistema',
          detail: message.text,
        });
      }     
      // if (message.room === this.currentUser.rol) {
      //   this.mensajes.push({ usuario, mensaje });
      if (message.room === this.currentUser.rol) {
        this.mensajes.push({ usuario, mensaje });


        if (file) {
          // const downloadLink = `<a href="${file}" download="archivo_descargado">Descargar archivo</a>`;
          const downloadLink = `<a href="${file}" download="archivo_descargado">Descargar archivo</a>`;
          this.messageService.add({
            severity: 'info', // Puedes ajustar la severidad según tu preferencia
            summary: 'Imagen adjunta',
            detail: downloadLink,
          });
        }

            // Detección de cambios en tiempo real
      this.cdr.detectChanges();

       // También podrías probar utilizando el método markForCheck
      this.cdr.markForCheck();

      }  
    },
    error: (err: any) => {
      console.error('Error en chat.component.ts:', err);
    },
    complete: () => {
      console.log('Conexión cerrada en chat.component.ts');
    }
  });
}

isCurrentUserMessage(mensajeUsuario: string): boolean {
  return mensajeUsuario === this.currentUser.nombre;
}

  //#endregion



  moverSala(sala: string, button: HTMLButtonElement) {
    // Agregar la llamada al método handleButtonClick
    this.handleButtonClick(button);

    // Resto de la lógica del método moverSala
    this.currentUser.rol = sala;
  }

  moverSala2(button: HTMLButtonElement) {
    // Agregar la llamada al método handleButtonClick
    this.handleButtonClick(button);

    // Resto de la lógica del método moverSala2
    this.currentUser = StorageHelper.getItem<IUser>('usuario')!;
  }
  
  guardarAvatar(): void {
    if (this.avatarUrl.trim() !== 'https://sstc.ac.in/img2/faculty/faculty.jpg') {
      StorageHelper.setAvatar(this.avatarUrl);
      this.userData.avatar = this.avatarUrl;
    }
  }


// CODIGO PARA PONER LOS SONIDOS !!!!!!
  sonidoAleatorioConectar() {
    const sonidos: string[] = [
      '/assets/Sonidos/006150542_prev.mp3',
      //'/Sonidos/siete_caballos_vienen_de_bonanza_chiquito_de_la_calzada.mp3',
      //'/Sonidos/chiquito_de_la_calzada_te_habla_un_hombre_malo_de_la_pradera.mp3',
    ];
  
    const indice: number = Math.floor(Math.random() * sonidos.length);
    const audio: HTMLAudioElement = new Audio(sonidos[indice]);
    audio.volume = 0.1; 
    audio.play();
  }


  getRoomName(): string {
    switch (this.currentUser.rol) {
      case 'admin':
        return 'SALA CONJUNTA';
      case 'Grupo 1':
        return 'SALA 1';
      case 'Grupo 2':
        return 'SALA 2';
      case 'Grupo 3':
        return 'SALA 3';
      case 'Grupo 4':
        return 'SALA 4';
      case 'Grupo 5':
        return 'SALA 5';
      case 'Grupo 6':
        return 'SALA 6';
      default:
        return this.currentUser.rol!;
    }
  }

  // de la lista back
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


  // MEtodo para actualizar el rol del usuario
  updateRole(newRole: string): void {
    this.loginService.updateUserRoleByEmail(newRole).subscribe(
      (response) => {
        console.log('Rol actualizado correctamente:', response);
        // Puedes realizar otras acciones después de actualizar el rol
      },
      (error) => {
        console.error('Error al actualizar el rol:', error);
        // Puedes manejar el error de acuerdo a tus necesidades
      }
    );
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        // Filtrar la lista de usuarios para encontrar el que coincide con userData.nombre
        const usuarioActual = data.find(usuario => usuario.nombre === this.userData.nombre);
        
        if (usuarioActual) {
          // Si se encuentra el usuario, asignarlo a this.usuarioActual
          this.usuarioActual = usuarioActual;
        } else {
          // Si no se encuentra el usuario, mostrar un mensaje de error o manejar la situación según sea necesario
          console.error('No se encontró el usuario actual en la lista de usuarios.');
        }
        
        console.log('Usuario actual obtenido en UsuariosComponent:', this.usuarioActual);
      },
      error: (err) => {
        alert('Error en el acceso a datos');
      }
    });
  }
  editarUsuario(usuario: any) {
    this.usuarioActual = usuario;
  }
  

  // BORRAR SI NO EXPLOITA NADA

  handleButtonClick(button: HTMLButtonElement) {
    // Remover la clase 'active' de todos los botones
    document.querySelectorAll('.custom-button').forEach(function (btn) {
      btn.classList.remove('active');
    });

    // Agregar la clase 'active' al botón clicado
    button.classList.add('active');
  }

  
}
