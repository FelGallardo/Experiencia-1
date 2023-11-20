import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Importa aquí la inicialización de Firebase
import { initializeApp } from 'firebase/app';


if(!navigator.geolocation){
  alert('Aplicacion no soporta la Geolocalizacion');
  throw new Error('Aplicacion no soporta la Geolocalizacion');
}

if (environment.production) {
  enableProdMode();
}

// Inicializa Firebase antes de iniciar la aplicación Angular
initializeApp(environment.firebaseConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));