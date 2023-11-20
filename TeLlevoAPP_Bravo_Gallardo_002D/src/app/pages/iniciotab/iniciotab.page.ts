import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaTopHeadlines } from 'src/app/interfaces/interfaces';
import { ClimaService } from 'src/app/services/clima.service';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-iniciotab',
  templateUrl: './iniciotab.page.html',
  styleUrls: ['./iniciotab.page.scss'],
})
export class IniciotabPage implements OnInit {
  autenticado: boolean = false;
  nombreuser: string = '';
  clima: any = {};

  constructor(
    private storageService: ServicesdatosService,
    private route: ActivatedRoute,
    private router: Router,
    private climaService: ClimaService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['correo']) {
        const correo = params['correo'];
        this.carga();
      }
    });

    this.climaService.getTopHeadLines().subscribe((data: RespuestaTopHeadlines) => {
      console.log('Datos del clima:', data);

      if (data && data.daily && data.daily.time.length >= 2) {
        // Obtener el clima del día de hoy y el de mañana
        this.clima = {
          time: [data.daily.time[0], data.daily.time[1]],
          temperature_2m_max: [data.daily.temperature_2m_max[0], data.daily.temperature_2m_max[1]],
          temperature_2m_min: [data.daily.temperature_2m_min[0], data.daily.temperature_2m_min[1]]
        };
      } else {
        console.error('Los datos del clima no tienen la estructura esperada.');
      }
    });
  }

  mapDia(numeroDia: number): string {
    const diasSemana = ['Hoy', 'Mañana'];
    return diasSemana[numeroDia];
  }

  async carga() {
    // Verificar si el usuario está autenticado usando localStorage
    const autenticadoStr = localStorage.getItem('autenticado');
    this.autenticado = autenticadoStr === 'true';
    const uid = await this.storageService.obtenerUIDUsuarioActual();
    let path = `users/${uid}`;

    if (this.autenticado && uid) {
      this.storageService.getDocument(path).then((user: User ) => {
        console.log('Usuario encontrado:', user);
        if (user) {
          console.log('Nombre de usuario:', user.nombre);
          this.nombreuser = user.nombre;  // Actualizar nombreuser si el usuario se carga correctamente
        } else {
          console.log('Usuario no encontrado o sin nombre.');
        }
      }).catch(error => {
        console.error('Error al obtener usuario:', error);
      });
    }
  }

  cerrarSesion() {
    this.storageService.cerrarSesion();
    this.router.navigate(['/iniciosesion']);  // Redirigir a la página de inicio de sesión
  }
}