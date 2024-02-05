import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppRoutingModule } from './app.routing/app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './pages/registro/usuarios.component';
import { ChatComponent } from './pages/PruebaChat/chat.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { SignalRService } from './services/signalr.service';
import { MessageInputComponent } from './pages/message-input/message-input.component';
import { UserChatService } from './services/UserChat.service';
import { HistorialComponent } from './pages/historial/historial.component';


import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { NavbarComponentFooter } from './navbarFooter/navbarFooter.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { perfilComponent } from './pages/perfil/perfil.component';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { BotonesComponent } from './pages/botones/botones.component';
import { LoginService } from './services/login.service';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { BaseDatosService } from './services/BaseDatos.service';
import { DataService } from './services/data.service';
import { FileDataService } from './services/fileData.Service';
import { ArchivosService } from './services/archivos.service';
import { ArchivosComponent } from './pages/archivos/archivos.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PerfilUsuariosComponent } from './pages/perfilUsuarios/perfilUsuarios.component';
import { MenubarModule } from 'primeng/menubar';


// configuacion para crear IndexedDB
// const dbConfig: DBConfig = {
//   name: 'myDb',
//   version: 1,
//   objectStoresMeta: [{
//     store: 'avatars',
//     storeConfig: { keyPath: 'id', autoIncrement: true },
//     storeSchema: [
//       { name: 'avatar', keypath: 'avatar', options: { unique: false } }
//     ]
//   }]
// };

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LoginComponent,
    ChatComponent,
    UsuariosComponent,
    NotFoundComponent,
    MessageInputComponent,
    HistorialComponent,
    NavbarComponent,
    SidebarComponent,
    NavbarComponentFooter,
    InicioComponent,
    perfilComponent,
    BotonesComponent,
    ArchivosComponent,
    PerfilUsuariosComponent

  ],
  imports: [
    BrowserModule,AppRoutingModule, HttpClientModule, 
    FormsModule,  ReactiveFormsModule,BrowserAnimationsModule, 
    DropdownModule, ButtonModule, ListboxModule, CardModule,
    MessagesModule, 
    SplitButtonModule,MenubarModule 
    
  ],
  providers: [SignalRService, 
    UserChatService, 
    MessageService, 
    ChatComponent, 
    LoginService,
    DataService,
    BaseDatosService,
    FileDataService,
    ArchivosService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
