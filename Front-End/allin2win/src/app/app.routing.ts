import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { LoginCasinoComponent } from './login-casino/login-casino.component';
import { RegisterCasinoComponent } from './register-casino/register-casino.component';
import { GamblerbomberComponent } from './gamblerbomber/gamblerbomber.component';
import { AuthGuard } from './auth.guard';
import { HomeNoUserComponent } from './home-no-user/home-no-user.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { RuletaComponent } from './ruleta/ruleta.component';

const appRoutes: Routes = [
  

  {path:'login', component: LoginCasinoComponent},
  {path:'register', component: RegisterCasinoComponent},
  {path:'gamblerbomber', component: GamblerbomberComponent},
  {path:'blackjack', component: BlackjackComponent},
  {path:'ruleta', component: RuletaComponent},


  {path:'**',
  component: HomeNoUserComponent,
  //canActivate:[AuthGuard]
}


]
  export const appRoutingProviders: any[]=[];
  export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(appRoutes,{ useHash: false });

