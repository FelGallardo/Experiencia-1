import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ServicesdatosService, Viaje } from 'src/app/services/servicesdatos.service';
import { environment } from 'src/environments/environment';


declare var google;

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.page.html',
  styleUrls: ['./crear-ruta.page.scss'],
})
export class CrearRutaPage implements OnInit, OnDestroy {

  newViajeForm: FormGroup;
  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  googleMaps: any;
  center = { lat: -33.51121437653384, lng: -70.75247732509393 };
  destino: any ;
  map: any;
  mapClickListener: any;
  directionsService: any;
  directionsRenderer: any;
  private googleGeocodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(
    private service: ServicesdatosService,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private navCtrl: NavController

  ) {
    this.newViajeForm = this.formBuilder.group({
      terminoV: ['', [Validators.required]],
      inicio: [this.center],
      NroPasajeros: ['', [Validators.required, Validators.maxLength(2)]],
      costo: ['', [Validators.required, Validators.maxLength(6)]]
    });
  }


  

  ngOnInit() {
    this.loadMap();
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
      this.onMapClick(); // Agrega la escucha de clics al mapa
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


  async obtenerCoordenadasDesdeDireccion(direccion: string): Promise<any> {
    const apiKey = 'AIzaSyBRACH5GQUpF8E04_wNRblfWHAlaSyIlSI';
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${apiKey}`
      );
      const data = await response.json();
  
      console.log('Respuesta de geocodificación:', data);
  
      if (data.status === 'ZERO_RESULTS') {
        console.warn('No se encontraron resultados de geocodificación para la dirección proporcionada.');
        return null;
      }
  
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log('Coordenadas obtenidas:', location);
        return { lat: location.lat, lng: location.lng };
      } else {
        console.warn('Respuesta inesperada de la API de geocodificación:', data);
        return null;
      }
    } catch (error) {
      console.error('Error en la geocodificación:', error);
      return null;
    }
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

  async CrearViaje() {
    try {
      let destinonom: any  = this.newViajeForm.value.terminoV;
      console.log('Destino: ', destinonom);
  
      let location: any = await this.obtenerCoordenadasDesdeDireccion(destinonom);
  
      console.log('Location:', location);

      this.destino = {
        latitud: location.lat,
        longitud: location.lng
      };

      console.log(this.destino);
      
  
      // Verifica si location tiene las propiedades latitud y longitud
      if (this.destino !== null && 'latitud' in this.destino && 'longitud' in this.destino) {
        this.calculateAndDisplayRoute(this.destino.latitud, this.destino.longitud);
      
        // Obtén el UID del usuario actual
        const uidConductor = await this.service.obtenerUIDUsuarioActual();
      
        const newViaje: Viaje = this.newViajeForm.value;
        newViaje.uidconductor = uidConductor;
      
        // Modifica esta parte para asignar un valor simple a 'destino'
        newViaje.destino = this.destino;
        newViaje.nomdestino = this.newViajeForm.value.terminoV;
        newViaje.inicionom = 'Duoc Uc';
        newViaje.inicio = this.center;
        newViaje.costo = this.newViajeForm.value.costo;
        newViaje.cantP = this.newViajeForm.value.NroPasajeros;
      
        let path = `viajes/${uidConductor}`;
      
        this.service.setDocument(path, newViaje).then(res => {
          console.log('Viaje Ingresado : ', res);
          this.navCtrl.navigateForward(`/viaje/${uidConductor}`);

        }).catch(error => {
          console.error('Error al ingresar el viaje:', error);
        });
      
      } else {
        console.warn('No se pudo obtener la ubicación válida. Verifica la dirección.');
      }
    } catch (error) {
      console.error('Error al calcular la ubicación:', error);
    }
  }
  

  async calcularViaje() {
    try {
      let destinonom: any  = this.newViajeForm.value.terminoV;
      console.log('Destino: ', destinonom);
  
      let location: any = await this.obtenerCoordenadasDesdeDireccion(destinonom);
  
      console.log('Location:', location);

      this.destino = {
        latitud: location.lat,
        longitud: location.lng
      };
  
      // Verifica si location tiene las propiedades latitud y longitud
      if (this.destino !== null && 'latitud' in this.destino && 'longitud' in this.destino) {
        this.calculateAndDisplayRoute(this.destino.latitud, this.destino.longitud);
      } else {
        console.warn('No se pudo obtener la ubicación válida. Verifica la dirección.');
      }
    } catch (error) {
      console.error('Error al calcular la ubicación:', error);
    }
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


  ngOnDestroy() {
    this.googleMaps.event.removeListener(this.mapClickListener);
  }
}