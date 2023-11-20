import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  autenticado: boolean = false;
  nombreuser: string = '';

  constructor(
    private storageService: ServicesdatosService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  vehi: boolean = false;

  ngOnInit() {
    // Obtener el estado de autenticación antes de cargar la página
    this.autenticado = this.storageService.estaAutenticado();
    console.log('Autenticado al inicio:', this.autenticado);

    

    this.route.paramMap.subscribe(params => {
      this.carga();
    });
  }

  cerrarSesion() {
    this.storageService.cambiaAuten(false);
    this.storageService.logout();
    this.router.navigate(['']);

  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
 


  async carga() {
    // Obtener el estado de autenticación al cargar la página
    this.autenticado = this.storageService.estaAutenticado();
    console.log('Autenticado en carga:', this.autenticado);
  
    const uidUsuarioActual = await this.storageService.obtenerUIDUsuarioActual();
    const vehiculoUsuario = await this.storageService.obtenerVehiculoPorUIDUsuario(uidUsuarioActual);
    
    if (vehiculoUsuario) {
      // El usuario tiene un vehículo, puedes acceder a sus propiedades aquí
      console.log('Vehículo del usuario:', vehiculoUsuario);
      this.vehi = vehiculoUsuario;
    } else {
      // El usuario no tiene un vehículo registrado
      console.log('El usuario no tiene un vehículo registrado.');
    }
  }
}