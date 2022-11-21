import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GamblerbomberComponent } from '../gamblerbomber/gamblerbomber.component';
// import { AvisComponent } from '../avis/avis.component';
import { Router, ActivatedRoute, ParamMap, Route } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.scss']
})
export class DialogExampleComponent implements OnInit {
  public form: FormGroup;
  tokens:any
  constructor(public dialogRef: MatDialogRef<DialogExampleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GamblerbomberComponent,public _router: Router,private fb:FormBuilder) {
      this.form=new FormGroup({
        tokens:new FormControl(),
        
      })
     }
  onNoClick(): void {
    

    this.dialogRef.close();
  }
  ngOnInit(): void {
    // console.log(this.data)
    this.form=this.fb.group( {
      tokens:['',[Validators.required,Validators.max((this.data.maxapostables)),Validators.pattern(/^\d+$/)]],
      
    })
  }

}
