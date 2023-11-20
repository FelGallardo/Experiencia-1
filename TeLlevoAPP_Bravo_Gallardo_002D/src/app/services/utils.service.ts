import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  router = inject(Router)

  constructor() { }






  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  
}
