import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IHistorial } from 'src/app/interfaces/historial.interface';

import { HistorialService } from 'src/app/services/Historial.service';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historial: IHistorial[] = [];
  salas: string[] = [];
  // salaSeleccionada = '';
  salaSeleccionada: string | null = 'Seleccione sala';
  fechaInicio: string = '';
  fechaFin: string = '';



  constructor(private historialService: HistorialService, private router: Router) { }





  ngOnInit(): void {
   
    this.getSalasDisponibles();
  }



  getHistorialChat(): void {
    if (!this.salaSeleccionada) {
      console.error('Seleccione una sala antes de obtener el historial del chat.');
      return;
    }


    if (!this.fechaInicio) {
      console.error('Seleccione una fecha para filtrar el historial.');
      return;
    }



    this.historialService.getHistorialChat(this.salaSeleccionada).subscribe(
      historial => {
        this.historial = historial.filter(mensaje => this.esMismoDia(new Date(mensaje.fechaMensaje), new Date(this.fechaInicio)));
        console.log(this.historial);
      },

      error => {
        console.error('Error al obtener el historial del chat:', error);
      }
    );
  }

  esMismoDia(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate();
  }

 

  getSalasDisponibles(): void {
    this.historialService.getSalasDisponibles().subscribe(
      salas => {
        this.salas = salas; 
        const primeraSala = this.salas.length > 0 ? this.getLabelForSala(this.salas[0]) : null;
        this.salaSeleccionada = null;
      },
      error => {
        console.error('Error al obtener la lista de salas:', error);
      }
    );
  }
  
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


  onChangeRoom(): void {
    this.getHistorialChat();
  }

  chat() {
    this.router.navigateByUrl('/chat');
  }



  descargarHistorial(): void {
    if (this.historial.length === 0 || !this.salaSeleccionada || !this.fechaInicio) {
      console.error('No hay historial para descargar o falta información.');
      return;
    }
  
    const nombreDia = this.getNombreDia();
    const nombreSala = this.getLabelForSala(this.salaSeleccionada);
    const nombreArchivo = `${nombreSala}_${nombreDia}_historial.txt`;
  
    const contenido = this.generarContenidoHistorial();
  
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
  
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  getNombreDia(): string {
    const fechaSeleccionada = new Date(this.fechaInicio);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
    return fechaSeleccionada.toLocaleDateString('es-ES', options);
  }
  
  generarContenidoHistorial(): string {
    const contenido = this.historial.map(mensaje => {
      // return ` (${mensaje.rol}) - ${mensaje.nombre} -   ${mensaje.texto}        || ${mensaje.fechaMensaje} `;
      // return `(${mensaje.rol}) - ${mensaje.nombre}   ${' '.repeat(5)} ${mensaje.fechaMensaje}\n${mensaje.texto}\n\n`;
     return ` [${mensaje.fechaMensaje}] -- [${mensaje.rol}] - ${mensaje.nombre} >>>>   ${mensaje.texto}   `;

    }).join('\n');
    return contenido;
  }
  

}
