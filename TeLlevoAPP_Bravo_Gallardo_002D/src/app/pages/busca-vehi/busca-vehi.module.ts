import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscaVehiPageRoutingModule } from './busca-vehi-routing.module';

import { BuscaVehiPage } from './busca-vehi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscaVehiPageRoutingModule
  ],
  declarations: [BuscaVehiPage]
})
export class BuscaVehiPageModule {}
