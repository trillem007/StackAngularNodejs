// import { Component, OnInit, DoCheck } from '@angular/core';

// @Component({
//   selector: 'app-servers',
//   templateUrl: './servers.component.html',
//   styleUrls: ['./servers.component.css']
// })
// export class ServersComponent implements DoCheck {

//   allowNewServer = false;
//   serverCreationStatus = 'No server was created!';
//   serverName = 'Testserver';
//   username= '';

//   constructor() { 
//     setTimeout(() => {
//       this.allowNewServer = true;
//     }, 2000);
//   }
//   ngOnInit(): void {
//   }
//   ngDoCheck(): void {
//     if (this.username!=''){
//       this.allowNewServer= true;
//     }else{this.allowNewServer= false;}

//   }
//   onCreateServer() {
//     this.serverCreationStatus = 'Server was created! Name is ' + this.serverName;
//     this.username= '';
//   }
//   onUpdateServerName(event: Event) {

//     //console.log(event);
//     this.serverName = (<HTMLInputElement>event.target).value;
//   }

// }