import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForm } from '../models/userform.users';
import { ProjectService } from '../services/project.service';
import { UploadService } from '../services/upload.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { userOnline } from '../models/user.users';
@Component({
  selector: 'app-register-casino',
  templateUrl: './register-casino.component.html',
  styleUrls: ['./register-casino.component.css'],
  providers: [ProjectService,UploadService]
})
export class RegisterCasinoComponent implements OnInit {
  public formregister: FormGroup;
  public userForm: UserForm;
  public projecte_desat: any;
  public filesToUpload: File[] = []
  public errorConta: any;
  public contaCorrecta: any;
  public UserOnline: userOnline
  constructor(
    private fb:FormBuilder,
    private _projectService: ProjectService,
    private _uploadService: UploadService,
    private route: Router

    ) {
    this.formregister=new FormGroup({
      email:new FormControl(),
      password:new FormControl()
    })
    this.userForm = new UserForm('','','','','',0);
   }
   ngOnInit(): void {
    if(this._projectService.loggedIn()){
      this.route.navigate(['/home'])
    }
    if (localStorage.getItem("joc")=="curs"){
      window.localStorage.removeItem('joc');

      window.location.reload();
    }
    this.formregister=this.fb.group( {
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*º_#<>¡=^?&|¿)(·])[A-Za-z\\d@$!%*º_#<>¡=^?&|¿)(·]{8,}$")]]
    })
  }
   send():any {
   
    this._projectService.saveProject(this.userForm).subscribe(
      response => {
        this.projecte_desat = response
        //console.log(this.projecte_desat)
        if (this.projecte_desat.project._id != "")
        {
          var token = response.token
          localStorage.setItem('token',token)
          
          // console.log(this.projecte_desat)
          // console.log(this.projecte_desat.project._id)
        //   this._uploadService.makeFileRequest(
        //     Global.url+'upload-image/'+this.projecte_desat.project._id,
        //     [],
        //     this.filesToUpload, 
        //     'avatar'
        //   ).then((result: any) => {
        //  //  console.log(result)
        //   });
          
          this.formregister.reset();
          this.contaCorrecta = true
          this.UserOnline = new userOnline(this.projecte_desat.project.email)  
          this._projectService.updateTokens(this.UserOnline,500).subscribe(
            response => {
              console.log(response)
              console.log(this.UserOnline)
              this.route.navigate(['/login'])
              
            },
            err =>{
      
            }
          )

        }
      },

      error => {
        // alert(<any>error.error.message)
        this.errorConta = error.error.message

      }
    )

    
    
  }
  

}
