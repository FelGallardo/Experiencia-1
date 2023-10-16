import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Agrega ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { IniciosesionPageRoutingModule } from './iniciosesion-routing.module';
import { IniciosesionPage } from './iniciosesion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Agrega ReactiveFormsModule
    IonicModule,
    IniciosesionPageRoutingModule
  ],
  declarations: [IniciosesionPage]
})
export class IniciosesionPageModule {}
