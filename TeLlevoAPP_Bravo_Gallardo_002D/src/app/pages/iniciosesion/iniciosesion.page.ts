import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-iniciosesion',
  templateUrl: './iniciosesion.page.html',
  styleUrls: ['./iniciosesion.page.scss'],
})
export class IniciosesionPage implements OnInit {
  newUserForm: FormGroup;

  constructor(
    private storageService: ServicesdatosService,
    private toastController: ToastController,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
    });
  }

  ngOnInit() {}

  async login() {
    if (this.newUserForm.valid) {
      const formData = this.newUserForm.value;
      console.log('Datos válidos:', formData);

      this.storageService.cambiaAuten(true);
      this.verifica(formData.correo, formData.contrasena);
    } else {
      this.showToast('Por favor, ingrese datos válidos.');
    }
  }

  verifica(correo: string, contrasena: string) {
    this.storageService.correopubic = correo;

    this.storageService.traeUsuario(correo).then((user) => {
      if (user) {
        if (user.contrasena === contrasena) {
          console.log('Inicio de sesión exitoso');
          localStorage.setItem('autenticado', 'true');
          this.showToast(`Bienvenido, ${user.nombre}!`);

          this.router.navigate(['/inicio/iniciotab'], { queryParams: { correo: user.correo } });
          this.storageService.cambiaAuten(true);
          console.log('Autenticado:', true);
        } else {
          console.log('Contraseña incorrecta');
          this.showToast('Contraseña incorrecta');
        }
      } else {
        console.log('Usuario no existe');
        this.showToast('Usuario no existe');
      }
    }).catch((error) => {
      console.error('Error al obtener usuario', error);
      this.showToast('Error al verificar usuario');
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}