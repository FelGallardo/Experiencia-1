import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IniciotabPageRoutingModule } from './iniciotab-routing.module';

import { IniciotabPage } from './iniciotab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniciotabPageRoutingModule
  ],
  declarations: [IniciotabPage]
})
export class IniciotabPageModule {}
