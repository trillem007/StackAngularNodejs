import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor() { }
  Carga(archivos:string[]){
    for(let archivo of archivos){
      let script = document.createElement("script");
      let link = document.createElement("link");
      script.src="./assets/"+archivo+"/"+archivo+".js"
      link.href="./assets/"+archivo+"/"+archivo+".css"
      link.rel="stylesheet"
      let body = document.getElementsByTagName("body")[0]
      let head = document.getElementsByTagName("head")[0]
      body.appendChild( script );
      head.appendChild( link )
    }
  }
}
