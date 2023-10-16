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

  constructor(private storageService: ServicesdatosService,   private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.actualizarEstadoVehiculo();

    
    this.route.paramMap.subscribe(params => {
      this.carga();
    });
  }

  private async actualizarEstadoVehiculo() {
    try {
      const tieneVehiculo = await this.storageService.usuarioTieneVehiculo(this.correo);
      this.vehi = tieneVehiculo;
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