import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { routing,appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
// import { ServersComponent } from './servers/servers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginCasinoComponent } from './login-casino/login-casino.component';
import { RegisterCasinoComponent } from './register-casino/register-casino.component';
import { GamblerbomberComponent } from './gamblerbomber/gamblerbomber.component';
import { ProjectService } from './services/project.service';
import { UploadService } from './services/upload.service';
import { AuthGuard } from './auth.guard';
import { HomeNoUserComponent } from './home-no-user/home-no-user.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material/material.module';
import { DialogExampleComponent } from './dialog-example/dialog-example.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { BlackjackComponent } from './blackjack/blackjack.component';
//cargar ruleta i blackjack
import { CargarScriptsService } from './cargar-scripts.service';
import { RuletaComponent } from './ruleta/ruleta.component';
//minimize gamblerbomber
import { AngularPageVisibilityModule } from 'angular-page-visibility';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    // ServersComponent,
    LoginCasinoComponent,
    RegisterCasinoComponent,
    GamblerbomberComponent,
    HomeNoUserComponent,
    DialogExampleComponent,
    BlackjackComponent,
    RuletaComponent,

  ],
  entryComponents: [
    DialogExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularPageVisibilityModule,
    
  ],
  providers: [appRoutingProviders, ProjectService , CookieService,CargarScriptsService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi:true
  }
  // ,{provide: LocationStrategy, useClass: HashLocationStrategy}
],
  bootstrap: [AppComponent]
})
export class AppModule { }
