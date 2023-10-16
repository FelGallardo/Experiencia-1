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
    console.log('correo encontrado',correo);
    // Asocia el vehículo al usuario si hay un usuario correspondiente al correo almacenado
    this.storageService.getUsuarioByCorreo(correo).then(user => {
      if (user) {
        user.vehiculo = this.newVehiculo;
  
        // Actualiza el usuario para asociar el vehículo
        this.storageService.updateUser(user).then(() => {
          console.log('Vehículo asociado al usuario:', user);
  
          // Muestra un mensaje indicando que el vehículo se ha asociado al usuario
          this.showToast('Vehículo asociado al usuario.');
  
          // Reinicia el nuevo vehículo
          this.newVehiculo = <Vehiculo>{};
  
          // Recarga la lista de vehículos
          this.loadVehiculo();
  
        }).catch(error => {
          console.error('Error al asociar vehículo al usuario:', error);
        });
      } else {
        console.error('No hay usuario correspondiente al correo almacenado.');
        return;
      }
    });
  
    // Almacena el vehículo de forma independiente
    this.storageService.addVehiculo(this.newVehiculo).then(() => {
      console.log('Vehículo registrado:', this.newVehiculo);
  
      // Muestra un mensaje indicando que el vehículo se ha registrado
      this.showToast('Vehículo registrado correctamente.');
  
      // Recarga la lista de vehículos
      this.loadVehiculo();
  
    }).catch(error => {
      console.error('Error al registrar vehículo:', error);
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