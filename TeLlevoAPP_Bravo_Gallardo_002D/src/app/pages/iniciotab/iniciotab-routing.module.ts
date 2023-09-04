import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IniciotabPage } from './iniciotab.page';

const routes: Routes = [
  {
    path: '',
    component: IniciotabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IniciotabPageRoutingModule {}
