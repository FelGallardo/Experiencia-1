import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IniciosesionPage } from './iniciosesion.page';

const routes: Routes = [
  {
    path: '',
    component: IniciosesionPage
  },
  {
    path: 'registro',
    loadChildren: () => import('./../../pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'iniciotab',
    loadChildren: () => import('./../../pages/iniciotab/iniciotab.module').then( m => m.IniciotabPageModule)
  },
  {
    path: 'olvidacontra',
    loadChildren: () => import('./../../pages/olvidacontra/olvidacontra.module').then( m => m.OlvidacontraPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IniciosesionPageRoutingModule {}
