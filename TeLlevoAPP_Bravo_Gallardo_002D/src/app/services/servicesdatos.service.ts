import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Vehiculo {
  idVehiculo: number;
  patente: string;
  marca: string;
  modelo: string;
  color: string;
}

export interface User {
  idUser: number;
  nombre: string;
  correo: string;
  contrasena: string;
  contrasena2: string;
  vehiculo: Vehiculo | null;
}

const ITEMS_KEY = 'my_datos';

@Injectable({
  providedIn: 'root',
})
export class ServicesdatosService {
  autenticado!: boolean;
  private _storage!: Storage;
  private storedCorreo!: string;

  public tiene: boolean = false;
  public correopubic!: string ;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async addVehiculo(vehiculo : Vehiculo):Promise<any>{
    return this.storage.get(ITEMS_KEY).then((vehiculos : Vehiculo[])=>{
      if(vehiculos){
        vehiculos.push(vehiculo);
        return this.storage.set(ITEMS_KEY, vehiculos);
      }else{
        return this.storage.set(ITEMS_KEY, [vehiculo])
      }
    });
  }

  estaAutenticado(): boolean {
    return this.autenticado;
  }

  getcorreo(){
    return this.correopubic
  }

  cambiaAuten(flag : boolean) {
     this.autenticado = flag;  
  }


  async usuarioTieneVehiculo(correo: string): Promise<boolean> {
    try {
      const user = await this.getUsuarioByCorreo(correo);
  
      if (user && user.vehiculo) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al verificar si el usuario tiene vehículo', error);
      throw error;
    }
  }
  
  login(correo: string, contra: string): Promise<boolean> {
    // Almacenamos el correo en la variable privada
    this.storedCorreo = correo;
    this.correopubic = this.storedCorreo;
    console.log('Correo almacenado:', this.storedCorreo);
    console.log('Correo almacenado2 :', this.correopubic);
    console.log('Autenticado:', this.autenticado);

    return this.storage.get(ITEMS_KEY).then((users: User[]) => {
      const userEncontrado = users.find(user => user.correo === correo && user.contrasena === contra);
      if (userEncontrado) {
        this.autenticado = true;
      } else {
        this.autenticado = false;
      }
      return !!userEncontrado;
    });
  }

  async getUsuarioByCorreo(correo: string): Promise<User | null> {
    try {
      const users = await this.storage.get(ITEMS_KEY);
  
      if (users && users.length > 0) {
        const foundUser = users.find((user: User) => user.correo === correo);
  
        if (foundUser) {
          return foundUser;
        }
      }
  
      return null;
    } catch (error) {
      console.error('Error al obtener usuarios', error);
      throw error;
    }
  }


  logout() {
    this.autenticado = false;
    localStorage.setItem('autenticado', 'false');
  }

  cerrarSesion() {
    this.autenticado = false;
    localStorage.removeItem('autenticado');
    localStorage.removeItem('correo');
  }


  async addUser(user: User): Promise<any> {
    return this.storage.get(ITEMS_KEY).then((users: User[]) => {
      if (users) {
        users.push(user);
        return this.storage.set(ITEMS_KEY, users);
      } else {
        return this.storage.set(ITEMS_KEY, [user]);
      }
    });
  }
  getVehiculo(): Promise<Vehiculo[]>{
    return this.storage.get(ITEMS_KEY);
  }

  getUser(): Promise<User[]>{
    return this.storage.get(ITEMS_KEY);
  }

  async traeUsuario(correo: string): Promise<User | null> {
    try {
      const users = await this.storage.get(ITEMS_KEY);
  
      if (users && users.length > 0) {
        const foundUser = users.find((user: { correo: string; }) => user.correo === correo);
  
        if (foundUser) {
          return foundUser;
        }
      }
  
      return null;
    } catch (error) {
      console.error('Error al obtener usuarios', error);
      throw error; // Re-lanzamos el error para que pueda ser manejado en un nivel superior
    }
  }

  async updateVehiculo(vehiculo : Vehiculo): Promise<any>{
    return this.storage.get(ITEMS_KEY).then((vehiculos : Vehiculo[])=>{
      if(!vehiculos || vehiculos.length == 0 ){
        return null;
      }
      let newVehiculo: Vehiculo[]=[];
      for(let i of vehiculos){
        if(i.idVehiculo == vehiculo.idVehiculo){
          newVehiculo.push(vehiculo);
        }else{
          newVehiculo.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, newVehiculo);
    })
  }

  async updateUser(user  : User): Promise<any>{
    return this.storage.get(ITEMS_KEY).then((users : User[])=>{
      if(!users || users.length == 0 ){
        return null;
      }
      let newUser: User[]=[];
      for(let i of users){
        if(i.idUser == user.idUser){
          newUser.push(user);
        }else{
          newUser.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, newUser);
    });
  }

  async deleteVehiculo(idVehiculo: number): Promise<Vehiculo>{
    return this.storage.get(ITEMS_KEY).then((vehiculos : Vehiculo[])=>{
      if(!vehiculos || vehiculos.length === 0){
        return null;
      }
      let toKeep: Vehiculo[] = [];
      for(let i of vehiculos){
        if(i.idVehiculo !== idVehiculo){
          toKeep.push(i)
        }
      }
      return this.storage.set(ITEMS_KEY, toKeep);
    });
  }

  async deleteUser(idUser: number): Promise<User>{
    return this.storage.get(ITEMS_KEY).then((users : User[])=>{
      if(!users || users.length === 0){
        return null;
      }
      let toKeep: User[] = [];
      for(let i of users){
        if(i.idUser !== idUser){
          toKeep.push(i)
        }
      }
      return this.storage.set(ITEMS_KEY, toKeep);
    });
  }


}
