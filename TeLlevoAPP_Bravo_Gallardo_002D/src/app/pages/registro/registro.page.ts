import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  newUserForm: FormGroup;

  constructor(
    private storageService: ServicesdatosService,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      contrasena: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(10)],
      ],
      contrasena2: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(10)],
      ],
    });
  }

  ngOnInit() {}

  addUser() {
    if (this.newUserForm.valid) {
      const newUser: User = this.newUserForm.value;
      if (newUser.contrasena === newUser.contrasena2) {
        newUser.idUser = Date.now();
        this.storageService.addUser(newUser).then(() => {
          this.newUserForm.reset();
          this.showToast('Usuario Registrado');
        });
      } else {
        this.showToast('Contraseñas no coinciden');
      }
    } else {
      this.showToast('Por favor, complete todos los campos correctamente.');
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
