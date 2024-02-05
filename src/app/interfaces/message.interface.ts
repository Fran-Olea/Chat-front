

export interface IMessage {
user: string;
text: string;
avatar: string;
room : string ;
// rol?: string;
// file: File | string | null; // para permitir tanto objetos File como URLs o null
file?: File | string; // para permitir tanto objetos File como URLs o null
timestamp?: Date;
//idUsuario?:number
id?: number,
}




  
