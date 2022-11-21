import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from './services/project.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _projectService:ProjectService,
              private _router: Router){}
  canActivate(): boolean {
    if(this._projectService.loggedIn()){
      return true
    }else{
      this._router.navigate(['/login'])
      return false
    }
  }
  
}
