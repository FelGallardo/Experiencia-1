import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: '',
    redirectTo: 'iniciosesion',
    pathMatch: 'full'
  },
  
  {
    path: 'busca-vehi',
    loadChildren: () => import('./pages/busca-vehi/busca-vehi.module').then( m => m.BuscaVehiPageModule)
  },
  {
    path: 'crear-ruta',
    loadChildren: () => import('./pages/crear-ruta/crear-ruta.module').then( m => m.CrearRutaPageModule)
  },
  {
    path: 'iniciotab',
    loadChildren: () => import('./pages/iniciotab/iniciotab.module').then( m => m.IniciotabPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'iniciosesion',
    loadChildren: () => import('./pages/iniciosesion/iniciosesion.module').then( m => m.IniciosesionPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'inicio/iniciotab/:correo',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'vehiculo',
    loadChildren: () => import('./pages/vehiculo/vehiculo.module').then( m => m.VehiculoPageModule)
  },
  {
    path: 'modificar',
    loadChildren: () => import('./pages/modificar/modificar.module').then( m => m.ModificarPageModule)
  },
  {
    path: 'olvidacontra',
    loadChildren: () => import('./pages/olvidacontra/olvidacontra.module').then( m => m.OlvidacontraPageModule)
  },
  {
    path: 'modifica-perfil/:uid',
    loadChildren: () => import('./pages/modifica-perfil/modifica-perfil.module').then(m => m.ModificaPerfilPageModule)
  },
  {
    path: 'ver-ruta/:uidconductor',
    loadChildren: () => import('./pages/ver-ruta/ver-ruta.module').then( m => m.VerRutaPageModule)
  },
  {
    path: 'viaje/:uidviaje',
    loadChildren: () => import('./pages/viaje/viaje.module').then( m => m.ViajePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
