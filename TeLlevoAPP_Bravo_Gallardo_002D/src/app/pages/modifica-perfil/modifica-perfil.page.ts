import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicesdatosService, User } from 'src/app/services/servicesdatos.service';

@Component({
  selector: 'app-modifica-perfil',
  templateUrl: './modifica-perfil.page.html',
  styleUrls: ['./modifica-perfil.page.scss'],
})
export class ModificaPerfilPage implements OnInit {

  newUserForm: FormGroup;
  
  desac=true;

  constructor(
    private storageService: ServicesdatosService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,

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

  ngOnInit() {
    // Obtener el UID de los parámetros de la ruta
    const uid: string = this.route.snapshot.paramMap.get('uid') || '';
    console.log(uid);
    
    if (uid) {
      // Preenchir el formulario con la información del usuario
      this.newUserForm.patchValue({
        uid: uid,
      });

      // Llama a la función loadUserInfo para cargar más detalles del usuario si es necesario
      this.loadUserInfo(uid);

      console.log('Estado del formulario después de cargar el usuario:', this.newUserForm.value);
    }
  }

  loadUserInfo(uid: string) {
    // Utiliza el UID para cargar la información del usuario y llenar el formulario
    this.storageService.getDocument(`users/${uid}`).then((user: User) => {
      if (user) {
        console.log('Usuario cargado:', user);
        this.newUserForm.patchValue({
          correo: user.correo,
          nombre: user.nombre,
          contrasena: user.contrasena,
          contrasena2: user.contrasena2,
          
        });
      } else {
        console.error('No se pudo cargar la información del usuario.');
      }
    });
  }

  ModificaUser() {
    if (this.newUserForm.valid) {
      const newUser: User = this.newUserForm.value;
      if (newUser.contrasena === newUser.contrasena2) {
        newUser.idUser = Date.now();
        let uid: string;

        // Utiliza la función creada en el servicio para obtener el UID del usuario actual
        this.storageService.obtenerUIDUsuarioActual().then((userUid: string | null) => {
          if (userUid) {
            uid = userUid;
            this.newUserForm.controls['uid'].setValue(uid);

            // Llama a la función que actualiza el perfil y la información en Firestore
            this.setUserInfo(uid);

            // También podrías mover la lógica de actnombre a este punto si es necesario
            this.storageService.actnombre(newUser.nombre).then(() => {
              console.log('Usuario modificado con éxito.');
            });

            // Elimina la llamada a addUser
            // this.storageService.addUser(newUser).then(() => {
            //   this.showToast('Usuario Registrado');
            // });
          } else {
            console.error('No se pudo obtener el UID del usuario actual.');
          }
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

      // Actualiza el perfil del usuario
      this.storageService.actnombre(newUser.nombre).then(() => {
        // Ahora, actualiza la información en Firestore
        this.storageService.updateDocument(path, this.newUserForm.value).then(async res => {
          this.newUserForm.reset();
          console.log('Respuesta de la actualización en Firestore:', res);
          this.router.navigate(['/inicio/iniciotab'], { queryParams: { correo: newUser.correo } });

        });
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