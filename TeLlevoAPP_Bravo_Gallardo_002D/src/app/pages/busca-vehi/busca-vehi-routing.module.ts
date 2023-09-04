import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscaVehiPage } from './busca-vehi.page';

const routes: Routes = [
  {
    path: '',
    component: BuscaVehiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscaVehiPageRoutingModule {}
