import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from "rxjs";

import { UserForm } from "../models/userform.users";
import { userOnline } from "../models/user.users";
import { LoginForm } from "../models/loginform.users";
import { Global } from "./global";
import { NgForm } from "@angular/forms";
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class ProjectService {
    public url: string;
    constructor (
        private _http: HttpClient,private cookies: CookieService
    ) {
        this.url = Global.url
    }


    saveProject(project:UserForm): Observable<any> {
        let params = JSON.stringify(project);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'save-project', params, {headers: headers});
    }

    loginProject(project: LoginForm): Observable<any> {
       // console.log(project)
        let params = JSON.stringify(project);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        
        return this._http.post(this.url+'login', params, {headers: headers});
    }

    logoutUser(){
        
        localStorage.removeItem("id")
        localStorage.removeItem("token")
        this.cookies.delete("tokenid");

    }

    getUser(email: userOnline): Observable<any> {
        let params = JSON.stringify(email);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+'getUser', params, {headers: headers});
    }

    
    updateTokens(email:userOnline, tokens:Number){
        let params = JSON.stringify(email);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'updateTokens' + "/" + tokens, params  , {headers: headers});
    }


    updateProject(id:String, project:UserForm): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'project/'+id, project, {headers: headers});
    }

    loggedIn() {
        // return !!localStorage.getItem('token')
        if(localStorage.getItem('token') && this.cookies.get("tokenid")){
            return true
        }
        else{
            return false
        }
    }

    getToken() {
        return localStorage.getItem('token')
    }
}
