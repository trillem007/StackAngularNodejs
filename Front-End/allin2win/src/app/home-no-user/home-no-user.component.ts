import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { userOnline } from '../models/user.users';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home-no-user',
  templateUrl: './home-no-user.component.html',
  styleUrls: ['./home-no-user.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeNoUserComponent implements OnInit {
  observer:MutationObserver
  email: any;
  compte:string;
  tokens:Number;
  user:any;
  sliderbug:boolean
  public UserOnline: userOnline
  @ViewChild('carousel',{read: ElementRef}) carouseel: ElementRef;
  @ViewChild('carousel') carousel: NgbCarousel;

  images = ["gamblerb.jpg", "ruleta.jpg", "bj.jpg"].map((n) => `../assets/images/${n}`);
  isMenuOpen=false;
  constructor(public config: NgbCarouselConfig,public _projectService: ProjectService,
    private _router: Router,private cookies: CookieService,private elementRef: ElementRef) {
    this.compte="";
    this.tokens=0;
    this.UserOnline = new userOnline(this.cookies.get("tokenid"))
    
   }
   ngAfterViewInit(): void {
    console.log(document.getElementsByClassName("carousel-item active")[0].id.charAt(16))
    console.log(document.getElementsByClassName("active")[1].getElementsByClassName("animacio"))

    // console.log(document.getElementsByClassName("carousel-item")[2].id)
    this.observer = new MutationObserver(mutations => {
      this.sliderbug=false
      mutations.forEach(function(mutation) {
        const antiga=Array.from(document.getElementsByClassName("active")[1].getElementsByClassName("animacio"))

        setTimeout(() => {
        let andres=Array.from(document.getElementsByClassName("active")[1].getElementsByClassName("animacio"))
          andres.forEach((element) => {
            if (!(element instanceof HTMLElement)) {
              return
            }
            antiga.forEach((element1) => {
              if (!(element1 instanceof HTMLElement)) {
                return
              }
              element1.classList.remove("animaciogen")
          }); 
            element.classList.add("animaciogen")
        }); 
      }, 800); 
      });   
    });
    var config = { attributes: true, childList: true, characterData: true };
    this.observer.observe(this.carouseel.nativeElement, config);
}  
  //FLECHAS SLIDER
  goslider(go:string){
    this.carousel.pause()
    let actual=Number(document.getElementsByClassName("carousel-item active")[0].id.charAt(16))
    let antiga=Array.from(document.getElementsByClassName("active")[1].getElementsByClassName("animacio"))
    if(actual==3){
      actual=0
    }
    else if(actual==4){
      actual=1
    }
    else if(actual==5){
      actual=2
    }
    document.getElementsByClassName("carousel-item")[actual].classList.remove("active")

    if(go=="prev"){
      if(actual==0){
        document.getElementsByClassName("carousel-item")[2].classList.add("active")
      }else{
        document.getElementsByClassName("carousel-item")[actual-1].classList.add("active")
      }
    }else{
      if(actual==2){
        document.getElementsByClassName("carousel-item")[0].classList.add("active")
      }else{
        document.getElementsByClassName("carousel-item")[actual+1].classList.add("active")
    }
    }
    
    let andres=Array.from(document.getElementsByClassName("active")[1].getElementsByClassName("animacio"))
    andres.forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return
      }
      antiga.forEach((element1) => {
        if (!(element1 instanceof HTMLElement)) {
          return
        }
        element1.classList.remove("animaciogen")
    }); 
      element.classList.add("animaciogen")
  });       
  
  }
  ngOnInit(): void {
    if (localStorage.getItem("joc")=="curs"){
      window.localStorage.removeItem('joc');

      window.location.reload();
    }

    
    if(this._projectService.loggedIn()){
    this._projectService.getUser(this.UserOnline).subscribe(
      response => {
        //console.log(response.message.email)
        //  if(response.message._id!=localStorage.getItem('id')){
        //     this._projectService.logoutUser()
        //     this._router.navigate(['/login'])
        //  }
        this.user = response.message
        this.compte=response.message.email
        this.tokens=response.message.tokens
        // console.log(response.message._id)
        // console.log(localStorage.getItem('id'))
        
      },
      err =>{
        this._router.navigate(['/login'])

        // localStorage.removeItem('token');
        // this._router.navigate(['/login'])

        if(err instanceof HttpErrorResponse){
          if(err.status===401){
            console.log(err)
            localStorage.removeItem('token');
            this._router.navigate(['/login'])
          }
        }

      }
    )
  }


  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}

  toggleMenu():void{
    this.isMenuOpen=!this.isMenuOpen
  }

}