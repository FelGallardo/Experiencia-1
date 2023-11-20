import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';


@Component({
  selector: 'app-olvidacontra',
  templateUrl: './olvidacontra.page.html',
  styleUrls: ['./olvidacontra.page.scss'],
})
export class OlvidacontraPage implements OnInit {

  UserForm: FormGroup;

  constructor(
    private storageService: ServicesdatosService,
    private toastController: ToastController,
    private formBuilder: FormBuilder
    ) {

    this.UserForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {


  }

  async login() {
    if (this.UserForm.valid) {
      const formData = this.UserForm.value;
      console.log('Datos válidos:', formData);

      this.storageService.cambiaAuten(true);

      this.storageService.enviarcorreorecupera(this.UserForm.value.correo). then(res=>{
        
      });
    } else {
      this.showToast('Por favor, ingrese datos válidos.');
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
