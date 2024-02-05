export interface IUser {
    id?: number;
    nombre?: string;
    email: string;
    password?: string;
    rol?: string;
    token?: string;
    avatar?: string;
    nuevaPassword?: string
  }
  
  export interface ITokenInfo {
    nombre: string;
    email: string;
    token: string;
    rol: string
  }