import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage,
    children:[
      {
        path: 'busca-vehi',
        loadChildren: () => import('./../../pages/busca-vehi/busca-vehi.module').then( m => m.BuscaVehiPageModule)
      },
      {
        path: 'crear-ruta',
        loadChildren: () => import('./../../pages/crear-ruta/crear-ruta.module').then( m => m.CrearRutaPageModule)
      },
      {
        path: 'iniciotab',
        loadChildren: () => import('./../../pages/iniciotab/iniciotab.module').then( m => m.IniciotabPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./../../pages/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./../../pages/about/about.module').then( m => m.AboutPageModule)
      },
      {
        path: 'iniciosesion',
        loadChildren: () => import('./../../pages/iniciosesion/iniciosesion.module').then( m => m.IniciosesionPageModule)
      },
      {
        path: 'registro',
        loadChildren: () => import('./../../pages/registro/registro.module').then( m => m.RegistroPageModule)
      },
      {
        path: 'modifica-perfil',
        loadChildren: () => import('./../../pages/modifica-perfil/modifica-perfil.module').then( m => m.ModificaPerfilPageModule)
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
