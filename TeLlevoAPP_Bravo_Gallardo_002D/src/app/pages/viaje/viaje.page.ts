import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesdatosService, User, Vehiculo, Viaje } from 'src/app/services/servicesdatos.service';


interface vehiculodata extends Vehiculo {
  patente: string;
}
interface UsuarioConNombre extends User {
  nombre: string;
  correo: string;
}


@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {


  viaje: Viaje;
  conductor: UsuarioConNombre;
  vehiculocon: vehiculodata;
  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  map: any;
  googleMaps: any;
  center = { lat: -33.51121437653384, lng: -70.75247732509393 };
  lati: any;
  lng: any;
  mapClickListener: any;
  directionsService: any;
  directionsRenderer: any;
  uid: any;


  private googleGeocodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json';


  constructor(
    private route: ActivatedRoute,
    private service: ServicesdatosService,
    private renderer: Renderer2,
    private router: Router,

  ) { }

  async ngOnInit() {
    // Obtén el ID del viaje de los parámetros de la URL
    const uidconductor = this.route.snapshot.paramMap.get('uidviaje');

    let path = `viajes/${uidconductor}`;
    this.getUsers(uidconductor);
    this.getVehiculo(uidconductor);
    let ver = this.service.obtenerUIDUsuarioActual();
    console.log('UID actual:', ver);
    await this.siconduc(ver);

    try {
      const usuid = await this.service.obtenerUIDUsuarioActual();
      console.log('UID del conductor:', ver);
      console.log('UID actual:', usuid);
  
      if (await uidconductor === usuid) {
        this.uid = true;
      }
      console.log('Valor de uid:', this.uid);
    } catch (error) {
      console.error('Error al obtener el UID actual:', error);
    }


    // Usa el ID para cargar la información específica del viaje
    this.service.getDocument(path).then((viajes: Viaje) => {
      console.log(viajes);

      this.viaje = viajes;
      console.log(this.viaje);
      this.lati = viajes.destino.lat
      this.lng = viajes.destino.lng
      console.log(this.lati, this.lng);


      this.loadMap();
      this.calcularViaje();
    },
      (error) => {
        console.error('Error al obtener detalles del viaje:', error);
      });
  }

  async siconduc(uidcon) {
    try {
      let usuid = await this.service.obtenerUIDUsuarioActual();
      console.log('UID del conductor:', uidcon);
      console.log('UID actual:', usuid);
  
      if (uidcon == usuid) {
        this.uid = true;
      }
      console.log('Valor de uid:', this.uid);
    } catch (error) {
      console.error('Error al obtener el UID actual:', error);
    }
  }
  async loadMap() {
    try {
      let googleMaps: any = await this.service.loadGoogleMaps();
      this.googleMaps = googleMaps;

      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 17,
        streetViewControl: false // Desactiva Street View
      });

      // Inicializa directionsService y directionsRenderer
      this.directionsService = new googleMaps.DirectionsService();
      this.directionsRenderer = new googleMaps.DirectionsRenderer();

      this.directionsRenderer.setMap(this.map);

      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);


    } catch (e) {
      console.error(e);
    }
  }
  onMapClick() {
    this.mapClickListener = this.googleMaps.event.addListener(this.map, 'click', (mapsMouseEvent) => {
      console.log(mapsMouseEvent.latLng.toJSON());
      this.addMarker(mapsMouseEvent.latLng);
    });
  }


  addMarker(location, isStartMarker = false) {
    const icon = {
      url: isStartMarker ? 'assets/icon/start.png' : 'assets/icon/ping.png',
      scaledSize: new this.googleMaps.Size(50, 50),
    };
    const marker = new this.googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      animation: this.googleMaps.Animation.DROP
    });
  }
  async calcularViaje() {
    try {

      let uidConductor = this.viaje.uidconductor;

      let path = `viajes/${uidConductor}`;

      this.service.getDocument(path).then((viaje: Viaje) => {

        let destino: any = {
          latitud: this.lati,
          longitud: this.lng
        };


        console.log('Destino: ', viaje.destino);

        console.log('Location:', destino);

        // Verifica si destino tiene las propiedades latitud y longitud
        if (viaje.destino !== null && 'latitud' in viaje.destino && 'longitud' in viaje.destino) {
          this.calculateAndDisplayRoute(viaje.destino.latitud, viaje.destino.longitud);
        } else {
          console.warn('No se pudo obtener la ubicación válida. Verifica la dirección.');
        }
      });
    } catch (error) {
      console.error('Error al calcular la ubicación:', error);
    }
  }

  getUsers(uid: any) {


    let path = `users/${uid}`;

    this.service.getDocument(path).then((users: User) => {
      console.log('user', users);
      this.conductor = users;
      

    });

  }
  getVehiculo(uid: any) {


    let path = `vehiculos/${uid}`;

    this.service.getDocument(path).then((vehiculos: Vehiculo) => {
      console.log('Vehiculo', vehiculos);
      this.vehiculocon = vehiculos;

    });

  }

  async eliminarviaje(){
    let uid = this.service.obtenerUIDUsuarioActual();
    this.eliminardoc(await uid);
  }

  eliminardoc(uid: string){
    
    let correo = this.conductor.email;
    let path = `viajes/${uid}`;
    this.router.navigate(['/inicio/iniciotab'], { queryParams: { correo } });

    this.service.eliminarDocumento(path);
  }

  calculateAndDisplayRoute(lat: any, lng: any) {
    console.log('calculateAndDisplayRoute - endLocation:', lat, lng);

    // Verifica si endLocation es una instancia válida de LatLng o LatLngLiteral
    if (!lat || !lng) {
      console.error('Formato de ubicación no válido para endLocation:', lat, lng);
      return;
    }

    // Convierte endLocation en una instancia de LatLng si no lo es
    const endLocation = new this.googleMaps.LatLng(lat, lng);

    const startLocation = new this.googleMaps.LatLng(this.center.lat, this.center.lng);

    const request = {
      origin: startLocation,
      destination: endLocation,
      travelMode: 'DRIVING',
    };

    this.directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        this.service.destino = endLocation;
        this.directionsRenderer.setDirections(response);
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    });
  }
}
