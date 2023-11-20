import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaPerfilPageRoutingModule } from './modifica-perfil-routing.module';

import { ReactiveFormsModule } from '@angular/forms';


import { ModificaPerfilPage } from './modifica-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ModificaPerfilPageRoutingModule
  ],
  declarations: [ModificaPerfilPage]
})
export class ModificaPerfilPageModule {}
