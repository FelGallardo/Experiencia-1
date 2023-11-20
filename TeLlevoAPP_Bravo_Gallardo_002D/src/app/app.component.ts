import { Component, OnInit } from '@angular/core';
import { ServicesdatosService } from './services/servicesdatos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  vehi: boolean = false;
  correo: string = 'correodeejemplo@mail.com';

  constructor(private storageService: ServicesdatosService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Suscríbete al observable vehi$
    this.storageService.vehi$.subscribe((tieneVehiculo) => {
      // Actualiza el valor de vehi cuando hay un cambio
      this.vehi = tieneVehiculo;
    });

    // Llama a la función de actualización al inicio
    this.actualizarEstadoVehiculo();

    // Suscríbete a los cambios en el paramMap
    this.route.paramMap.subscribe(params => {
      // Llama a la función de carga cuando hay cambios en los parámetros
      this.carga();
    });
  }

  private async actualizarEstadoVehiculo() {
    try {
      const uidUsuario = await this.storageService.obtenerUIDUsuarioActual();
      if (uidUsuario) {
        const tieneVehiculo = await this.storageService.obtenerVehiculoPorUIDUsuario(uidUsuario);
        console.log('Resultado tiene vehículo:', tieneVehiculo);

        // La actualización de vehi se maneja automáticamente a través del observable
      }
    } catch (error) {
      console.error('Error al verificar si el usuario tiene vehículo', error);
    }
  }

  cerrarSesion() {
    this.storageService.cerrarSesion();
  }

  async carga() {
    this.actualizarEstadoVehiculo();
  }
}