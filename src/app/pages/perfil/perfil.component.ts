import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { BaseDatosService } from 'src/app/services/BaseDatos.service';
import { DataService } from 'src/app/services/data.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],

})
export class perfilComponent implements OnInit {
  avatares: any[] = []; // Definición de la propiedad avatares como un array vacío
  selectedFile: File | null = null; // Inicializar selectedFile como null
 
  avataresBack = [
    { nombre: 'Avatar 1', url: 'https://avatarfiles.alphacoders.com/120/120060.jpg' },
    { nombre: 'Avatar 2', url: 'https://cdn.icon-icons.com/icons2/1576/PNG/512/3561839-emoji-emoticon-silly_107878.png' },
    { nombre: 'Avatar 3', url: 'https://th.bing.com/th/id/OIP.th8AjwRm63Ooh3XIZg5eAAHaF8?rs=1&pid=ImgDetMain' },
    { nombre: 'Avatar 4', url: 'https://i.pinimg.com/736x/90/05/80/900580e1df8f3a9858736f21dde029fd.jpg' }
  ];

  
  // avatarUrl3: string | ArrayBuffer | null | undefined = null;
  // avatarFile: File | null = null;
  //   userId!: number;

  usuarios: IUser[] = [];
  usuarioActual: any;


  avatars$: Observable<any[]>;
  avatarSubscription: Subscription | undefined;
  avatarLoaded: boolean = false;
  avatarExists: boolean = false;
  avatarUrl2: string = '';  


  userData: IUser;
  avatarUrl: string = '';  
  salaSeleccionada: string = ''; 

  constructor( private router: Router,
    private dataService: DataService,
    private baseDatosService: BaseDatosService,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,


    )
   {   
     this.avatars$ = this.dataService.getAvatars(); // Inicializando en el constructor


    this.userData = {
    ...StorageHelper.getItem<IUser>('usuario')!,
    avatar: StorageHelper.getAvatar()!,
  };


}

ngOnInit(): void {

  this.getUsuarios();
  this.editarUsuario(this.usuarioActual);


  // #region antiguo
  this.salaSeleccionada = this.userData.rol!;
  // this.dataService.clearAvatars();

  this.avatarSubscription = this.dataService.avatars$.subscribe(avatars => {
    const avatar = avatars.find(avatar => avatar.id === this.userData.id);
    if (avatar) {
      this.avatarUrl2 = avatar.avatar;
      this.avatarExists = true;
    } else {
      this.avatarExists = false;
    }
    this.avatarLoaded = true;
  });
}
//#endregion


// getUsuarios() {
//   this.usuariosService.getUsuarios().subscribe({
//     next: (data) => {
//       this.usuarios = data;
      
//     console.log('Usuarios obtenidos en UsuariosComponent:', data);
//     // this.userChatService.actualizarUsuariosConectados(data);
    
//     },
//     error: (err) => {
//       alert('Error en el acceso a datos');
//     }
//   });
// }
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


updateUsuarios(usuario: IUser): void {
  const confirmacion = confirm('¿Estás seguro de que deseas actualizar su avatar?');
  if (confirmacion) {
    this.usuariosService.updateUsuarios(usuario).subscribe({
      next: () => {
        alert('Avatar actualizado correctamente');
      },
      error: () => {
        alert('Error al actualizar el avatar');
      }
    });
  }
}




editarUsuario(usuario: any) {
  this.usuarioActual = usuario;
}


//#region AVATAR LOCALSTORAGE
  guardarAvatar(): void {
    // guarda la URL del avatar en el StorageHelper y actualiza el objeto userData
    if (this.avatarUrl.trim() !== 'https://sstc.ac.in/img2/faculty/faculty.jpg') {
      StorageHelper.setAvatar(this.avatarUrl);
      this.userData.avatar = this.avatarUrl;
    }
  }
//#endregion


  //#region a localstorage avatar imagen de fondo

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const avatar = {
          id: this.userData.id, // Usa el ID del usuario
          avatar: e.target.result
        };
        this.dataService.addOrUpdateAvatar(avatar);
      };
    }
  }


  // saveAvatar(): void {
  //   // Implementa lógica adicional si es necesario para guardar el avatar
  // }


  ngOnDestroy(): void {
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }


  getAvatarUrl(): string {
    if (this.avatarExists) {
      return this.avatarUrl2;
    } else {
      return 'https://sstc.ac.in/img2/faculty/faculty.jpg';
    }
  }
//#endregion





// #region AVATAR A SERVIDOR FRONT INDEXDB BUGEADO


guardarAvatarFront() {
  if (this.selectedFile) {
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      const avatar = { avatar: reader.result };
      this.baseDatosService.guardarAvatar(avatar).subscribe(() => {
        console.log('Avatar guardado correctamente');
      });
    };
  }
}

obtenerAvatares() {
  this.baseDatosService.obtenerAvatares().subscribe(avatares => {
    this.avatares = avatares;
  });
}

onFileSelected2(event: any) {
  this.selectedFile = event.target.files[0];
}
//#endregion

}
