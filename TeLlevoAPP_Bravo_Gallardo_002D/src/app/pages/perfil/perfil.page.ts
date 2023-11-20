import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IdTokenResult } from 'firebase/auth';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: User = {
    uid: '' ,
    idUser: 0,
    nombre: '',
    correo: '',
    contrasena: '',
    contrasena2: '',
    vehiculo: null,
    emailVerified: false,
    isAnonymous: false,
    metadata: undefined,
    providerData: [],
    refreshToken: '',
    tenantId: '',
    delete: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    getIdToken: function (forceRefresh?: boolean): Promise<string> {
      throw new Error('Function not implemented.');
    },
    getIdTokenResult: function (forceRefresh?: boolean): Promise<IdTokenResult> {
      throw new Error('Function not implemented.');
    },
    reload: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    toJSON: function (): object {
      throw new Error('Function not implemented.');
    },
    displayName: '',
    email: '',
    phoneNumber: '',
    photoURL: '',
    providerId: ''
  };

  constructor(
    private storageService: ServicesdatosService,
    private navCtrl: NavController,
    private router: Router // Agrega esto
  ) { }

  nombre: string = '';
  correo: string = '';
  contrasena: string = '';

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.getUsers();
  }

  async getUsers() {
    const uid = await this.storageService.obtenerUIDUsuarioActual();
    let path = `users/${uid}`;

    this.storageService.getDocument(path).then((user: User) => {
      this.nombre = user.nombre;
      this.correo = user.correo;
      this.contrasena = user.contrasena;


      
      this.usuario.uid = user.uid;
      this.usuario.nombre = user.nombre;
      this.usuario.contrasena = user.contrasena;
      this.usuario.correo = user.correo;
      this.usuario.contrasena2 = user.contrasena2;

      console.log(user);
    });
  }

  irAModificarPerfil() {
    this.navCtrl.navigateForward(['/modifica-perfil', this.usuario.uid]);
  }
}