import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ServicesdatosService, Viaje } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-busca-vehi',
  templateUrl: './busca-vehi.page.html',
  styleUrls: ['./busca-vehi.page.scss'],
})
export class BuscaVehiPage implements OnInit {


  // Define una lista para almacenar todos los viajes
  nViajes: Viaje[] = [];

  constructor(private service: ServicesdatosService,    private navCtrl: NavController
    ) { }

  ngOnInit() {
    this.getViajes();
  }

  getViajes() {
    try {
      let path = 'viajes/';

      // Obtén el Observable de la colección de viajes
      const viajesObservable = this.service.getCollectionData(path);

      // Suscríbete al Observable para obtener los datos reales
      viajesObservable.subscribe(
        (viajes: Viaje[]) => {
          // Actualiza la lista de viajes con los datos obtenidos
          this.nViajes = viajes;
          console.log(viajes);
          

          
        },
        (error) => {
          console.error('Error al obtener viajes:', error);
        }
      );
    } catch (error) {
      console.error('Error al obtener viajes:', error);
    }
  }
  
  irAModificarPerfil(uidconductor: any) {
    console.log('ID del viaje:', uidconductor);

    
    if (uidconductor) {
      this.navCtrl.navigateForward(['/ver-ruta', uidconductor]);
    } else {
      console.error('El ID del viaje es nulo o indefinido.');
    }
  }
}