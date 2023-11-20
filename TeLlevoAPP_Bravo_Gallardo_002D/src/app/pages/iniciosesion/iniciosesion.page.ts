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

      this.storageService.login(this.newUserForm.value.correo, this.newUserForm.value.contrasena). then(res=>{
        
        this.getUserInfo(res.user.uid);

      });
      this.storageService.correopubic = this.newUserForm.value.correo;
    } else {
      this.showToast('Por favor, ingrese datos válidos.');
    }
  }
  getUserInfo(uid: string) {
    if (this.newUserForm.valid) {
      const newUser: User = this.newUserForm.value;

      newUser.idUser = Date.now();

      let path = `users/${uid}`;
      

      this.storageService.getDocument(path).then((user: User) => {

         this.storageService.actnombre(newUser.nombre);
        this.storageService.cambiaAuten(true);
        localStorage.setItem('autenticado', 'true');
        this.router.navigate(['/inicio/iniciotab'], { queryParams: { correo: newUser.correo } });
        this.newUserForm.reset();

      
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