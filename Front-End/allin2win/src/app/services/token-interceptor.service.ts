import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectService } from './project.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let projectService = this.injector.get(ProjectService)
    let tokenizedReq=req.clone({setHeaders:{
      Authorization:`Bearer ${projectService.getToken()}`
    }
  })
  return next.handle(tokenizedReq)
  }
}
