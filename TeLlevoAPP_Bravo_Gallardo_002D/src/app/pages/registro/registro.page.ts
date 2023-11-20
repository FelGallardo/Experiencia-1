import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  newUserForm: FormGroup;


  constructor(
    private storageService: ServicesdatosService,
    private Utils: UtilsService,
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      uid: [''],
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

  ngOnInit() { }

  addUser() {
    if (this.newUserForm.valid) {
      const newUser: User = this.newUserForm.value;
      if (newUser.contrasena === newUser.contrasena2) {
        newUser.idUser = Date.now();
        this.storageService.crearUsuario(newUser.correo, newUser.contrasena).then(async res => {

          let uid = res.user.uid;
          this.newUserForm.controls['uid'].setValue(uid);

          console.log(uid);
          this.setUserInfo(uid);

          await this.storageService.actnombre(newUser.nombre);
          console.log(res);
        });
        this.storageService.addUser(newUser).then(() => {
          this.showToast('Usuario Registrado');
        });
      } else {
        this.showToast('Contraseñas no coinciden');
      }
    } else {
      this.showToast('Por favor, complete todos los campos correctamente.');
    }
  }

  setUserInfo(uid: string) {
    if (this.newUserForm.valid) {
      const newUser: User = this.newUserForm.value;

      newUser.idUser = Date.now();

      let path = `users/${uid}`;


      this.storageService.setDocument(path, this.newUserForm.value).then(async res => {

        await this.storageService.actnombre(newUser.nombre);
        this.storageService.cambiaAuten(true);
        localStorage.setItem('autenticado', 'true');
        this.router.navigate(['/inicio/iniciotab'], { queryParams: { correo: newUser.correo } });
        this.newUserForm.reset();

        console.log(res);
      });
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
