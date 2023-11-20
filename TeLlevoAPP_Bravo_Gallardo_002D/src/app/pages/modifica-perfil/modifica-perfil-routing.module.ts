import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaPerfilPage } from './modifica-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaPerfilPageRoutingModule {}
