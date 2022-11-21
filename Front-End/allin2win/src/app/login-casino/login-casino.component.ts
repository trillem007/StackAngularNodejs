import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForm } from '../models/userform.users';
import { ProjectService } from '../services/project.service';
import { UploadService } from '../services/upload.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-casino',
  templateUrl: './login-casino.component.html',
  styleUrls: ['./login-casino.component.css'],
  providers: [ProjectService,UploadService]
})
export class LoginCasinoComponent implements OnInit {
  public userForm: UserForm;
  public projecte_desat: any;
  public filesToUpload: File[] = []
  public errorConta: any;
  public contaCorrecta: any;
  public form: FormGroup;
  public passval:boolean

  constructor(private fb:FormBuilder, 
    private _projectService: ProjectService,
    private cookies: CookieService,
    private route: Router) {
    this.form=new FormGroup({
      email:new FormControl(),
      password:new FormControl()
    })
    this.userForm = new UserForm('','','','','',0);

   }

  ngOnInit(): void {
    if(this._projectService.loggedIn() || this.cookies.get("tokenid")){
      this.route.navigate(['/'])
    }
    if (localStorage.getItem("joc")=="curs"){
      window.localStorage.removeItem('joc');

      window.location.reload();
    }
    this.form=this.fb.group( {
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*º_#<>¡=^?&|¿)(·])[A-Za-z\\d@$!%*º_#<>¡=^?&|¿)(·]{8,}$")]]
    })
  }
  send():any{
    this._projectService.loginProject(this.userForm).subscribe(
      response => {
        // console.log(response)
        // console.log(response.project)
        // console.log(this.userForm.email)
        
        var token = response.token
        localStorage.setItem('id',response.project._id)
        this.cookies.set("tokenid",this.userForm.email)
        localStorage.setItem('token',token)
        
        this.route.navigate(['/'])
        

        
      },

      error => {
        
        this.errorConta = error.error.message
      }
    )
  }

}
