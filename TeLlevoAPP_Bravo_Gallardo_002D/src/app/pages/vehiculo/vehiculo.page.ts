import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, Platform, ToastController } from '@ionic/angular';
import { ServicesdatosService, Vehiculo, User } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.page.html',
  styleUrls: ['./vehiculo.page.scss'],
})
export class VehiculoPage implements OnInit {

  vehiculo: Vehiculo[] = [];
  newVehiculo: Vehiculo = <Vehiculo>{};
  @ViewChild('myList') myList!: IonList;

  // Agregado: Variable para almacenar el usuario actual
  currentUser: User | null = null;

  constructor(
    private storageService: ServicesdatosService,
    private plt: Platform,
    private toastController: ToastController
  ) {
    this.plt.ready().then(() => {
      this.loadVehiculo();
      this.loadCurrentUser();
    });
  }

  ngOnInit() {}

  loadVehiculo() {
    this.storageService.getVehiculo().then(vehiculos => {
      this.vehiculo = vehiculos;
    });
  }

  // Agregado: Método para cargar el usuario actual
  loadCurrentUser() {
    const correo = this.storageService.correopubic;
    console.log(correo);
    if (correo) {
      this.storageService.traeUsuario(correo).then((user: User | null) => {
        this.currentUser = user;
  
        // Verifica si el vehículo está asociado al usuario
        if (this.currentUser && this.currentUser.vehiculo) {
          console.log('El vehículo está asociado al usuario:', this.currentUser.vehiculo);
  
          // Muestra un mensaje indicando que el vehículo se ha asociado al usuario
          this.showToast('Vehículo asociado al usuario.');
  
        } else {
          console.log('El vehículo no está asociado al usuario.');
        }
  
      }).catch(error => {
        console.error('Error al obtener usuario:', error);
      });
    }
  }

  addVehiculo() {
    this.newVehiculo.idVehiculo = Date.now();
    const correo = this.storageService.correopubic;
    console.log('correo encontrado', correo);

    // Agregado: Obtener el UID del usuario actual
    this.storageService.obtenerUIDUsuarioActual().then((uid: string | null) => {
      if (uid) {
        // Asocia el vehículo al usuario actual
        this.newVehiculo.uid = uid;
        
        // Almacena el vehículo como un documento en Firestore
        const path = 'vehiculos'; // Puedes cambiar el nombre de la colección según tus necesidades
        this.storageService.setDocument(path + '/' + this.newVehiculo.uid, this.newVehiculo)
          .then(() => {
            console.log('Vehículo asociado al usuario y almacenado en Firestore:', this.newVehiculo);

            // Muestra un mensaje indicando que el vehículo se ha asociado al usuario y almacenado en Firestore
            this.showToast('Vehículo asociado al usuario y almacenado en Firestore correctamente.');

            // Reinicia el nuevo vehículo
            this.newVehiculo = <Vehiculo>{};

            // Recarga la lista de vehículos
            this.loadVehiculo();
          })
          .catch(error => {
            console.error('Error al almacenar el vehículo en Firestore:', error);
          });
      } else {
        console.error('No se pudo obtener el UID del usuario actual.');
      }
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}