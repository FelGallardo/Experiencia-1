import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, Subject } from 'rxjs';
// Firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, query, where , collectionData, updateDoc ,deleteDoc, DocumentReference, DocumentData } from '@angular/fire/firestore';
import {  getDocs } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { deleteObject, getStorage, ref } from 'firebase/storage'

export interface Vehiculo {
  nombreDoc: any;
  uid: string;
  idVehiculo: number;
  patente: string;
  marca: string;
  modelo: string;
  color: string;
}

export interface User extends FirebaseUser{
  uid: string;
  idUser: number;
  nombre: string;
  correo: string;
  contrasena: string;
  contrasena2: string;
  vehiculo: Vehiculo | null;
}

export interface Viaje {
  id: string;
  inicio: {
    lat: any;
    lng: any;
  };
  inicionom: string; 
    destino: {
      lat: any;
      lng: any;
    };
  
  nomdestino: string;
  cantP: number;
  uidconductor: any ;
  uidpasajero1: any | null;
  uidpasajero2: any | null;
  uidpasajero3: any | null;
  uidpasajero4: any | null;
  costo: number;

}

const ITEMS_KEY = 'my_datos';

@Injectable({
  providedIn: 'root',
})
export class ServicesdatosService {

  

//fire
  auth = inject(AngularFireAuth);

  autenticado!: boolean;
  private _storage!: Storage;
  private storedCorreo!: string;

  public destino: any;
  public tiene: boolean = false;
  public correopubic!: string ;

  constructor(private storage: Storage, private afAuth: AngularFireAuth, private firestore: AngularFirestore, ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }
  
  async obtenerUIDUsuarioActual(): Promise<string | null> {
    try {
      const user = getAuth().currentUser;
      if (user) {
        return user.uid;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener el UID:', error);
      return null;
    }
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

  private vehiSubject = new Subject<boolean>();
  vehi$ = this.vehiSubject.asObservable();

  async obtenerVehiculoPorUIDUsuario(uidUsuario: string): Promise<boolean> {
    try {
      // Obtén el documento del vehículo usando el UID del usuario como nombre de documento
      const vehiculoDoc = await getDoc(doc(getFirestore(), 'vehiculos', uidUsuario));

      // Devuelve true si el documento existe, de lo contrario, devuelve false
      const tieneVehiculo = vehiculoDoc.exists();
      this.vehiSubject.next(tieneVehiculo); // Emitir cambio
      return tieneVehiculo;
    } catch (error) {
      console.error('Error al obtener el vehículo por UID de usuario:', error);
      return false;
    }
  }


  //FireStor............
  
  login(email : string, password : string) {
    return signInWithEmailAndPassword(getAuth(),email, password);
  }

  crearUsuario(email : string, password : string) {
    return createUserWithEmailAndPassword(getAuth(),email, password);
  }

  actnombre(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(),path),data);
  }
  updateDocument(path: string, data: any){
    return updateDoc(doc(getFirestore(),path),data);
  }
  async eliminarDocumento(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  async getDocument(path: string){
    
    return (await getDoc(doc(getFirestore(),path))).data();
  }

  enviarcorreorecupera(email: string){
    return sendPasswordResetEmail(getAuth(),email);
  }

  async obtenerDocumentoPorUid(uid: string, collectionName: string): Promise<any> {
    try {
      const docRef = doc(getFirestore(), collectionName, uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('El documento no existe.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      return null;
    }
  }

  getCollectionData(path: string, collectionQuery? : any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery));
  }



  //....................

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


  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps) {
     return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsApiKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }


}
