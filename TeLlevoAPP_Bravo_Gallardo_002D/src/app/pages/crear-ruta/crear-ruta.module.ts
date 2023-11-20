import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearRutaPageRoutingModule } from './crear-ruta-routing.module';

import { CrearRutaPage } from './crear-ruta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,  // Agrega ReactiveFormsModule
    CrearRutaPageRoutingModule
  ],
  declarations: [CrearRutaPage]
})
export class CrearRutaPageModule {}
