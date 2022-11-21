import { Component, ComponentFactoryResolver, OnInit, ChangeDetectionStrategy, DoCheck, OnChanges, SimpleChanges  } from '@angular/core';
import * as Phaser from 'phaser';
import { ProjectService } from '../services/project.service';
import { userOnline } from '../models/user.users';
import {
  OnPageVisible, OnPageHidden,
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum,
  OnPagePrerender, OnPageUnloaded} from 'angular-page-visibility';
import { Router, ActivatedRoute, ParamMap, Route } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog} from '@angular/material/dialog'
import { DialogExampleComponent } from '../dialog-example/dialog-example.component';
import { CookieService } from 'ngx-cookie-service';
import { timer } from 'rxjs';

// const token=localStorage.getItem('token');
// console.log(token)
// import internal from 'stream';


@Component({
  selector: 'app-gamblerbomber',
  templateUrl: './gamblerbomber.component.html',
  styleUrls: ['./gamblerbomber.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,

})
export class GamblerbomberComponent implements OnInit, DoCheck {
  @OnPageVisible()
  logWhenPageVisible (): void {
    this.seguir=true
    // console.log(this.seguir)

  }
  @OnPageHidden()
  logWhenPageHidden (): void {
    this.seguir=false
    // console.log(this.seguir)
  }
  phaserGame: any;
  config: Phaser.Types.Core.GameConfig;
  email: any;
  public UserOnline: userOnline
  user:any
  tokens2:Number
  contadorVictories:any
  quantitat:Number
  token:any
  maxapostables:number
  advertencia:String
  //fecha
  segons = 0;
  timer = null;
  timer2 = null;
  tabed:boolean
  seguir:boolean

  source = timer(0, 1000);
  clock: any;
  constructor(public route: Router,private _projectService: ProjectService,private _router: Router,public dialog: MatDialog
    ,private cookies: CookieService) {
    this.config = {
      type: Phaser.AUTO,
      height: 500,
      width: 640,
      backgroundColor:"#000000",
      scene: [ Game, DeathScene ],
      scale: { mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH},
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        } 
      }
     
    };
    
    this.email=this.cookies.get("tokenid");
    this.UserOnline = new userOnline(this.email)
    this.tokens2=0
    this.contadorVictories=0
    this.token=localStorage.getItem('token');
    this.maxapostables=0
    this.advertencia=""
    this.tabed=false
    
} 

  ngDoCheck(): void {
    if(localStorage.getItem("token")==this.token+"+" && this.contadorVictories==0 ){
        // this._router.navigate(["/"])
        this.contadorVictories+=1
        if(this.segons>21){
          setTimeout(() => {
            this._projectService.getUser(this.UserOnline).subscribe(
                response => {
                   
                   this.user = response.message
                   this.tokens2=Number(this.user.tokens)+Number(this.quantitat)
                   this._projectService.updateTokens(this.UserOnline,this.tokens2).subscribe(
                    response => {
                      window.location.reload();   

                    },
                    err =>{
    
                    }
                  )
                  
                },
                err =>{
                  localStorage.removeItem('token');
                  this._router.navigate(['/login'])
                  if(err instanceof HttpErrorResponse){
                    if(err.status===401){
                      console.log(err)
                      this._router.navigate(['/login'])
                    }
                  }
          
                }
              )
        }, 390);
        }
        
        
    }
    if(localStorage.getItem("token")==this.token+"-" && this.contadorVictories==0){
        // this._router.navigate(["/"])
        this.contadorVictories+=1
        
        setTimeout(() => {
            this._projectService.getUser(this.UserOnline).subscribe(
                response => {
                   //console.log(response.message.email)
                   
                   this.user = response.message
                   this.tokens2=Number(this.user.tokens)-Number(this.quantitat)
                   this._projectService.updateTokens(this.UserOnline,this.tokens2).subscribe(
                    response => {
        
                    },
                    err =>{
                        console.log("error real")
                    }
                  )
                  
                },
                err =>{
                  localStorage.removeItem('token');
                  this._router.navigate(['/login'])
                  if(err instanceof HttpErrorResponse){
                    if(err.status===401){
                      this._router.navigate(['/login'])
                    }
                  }
          
                }
              )
        }, 390);
        
    }
  }
  showDate(){
    if(this.seguir==false && this.segons>15){
      clearInterval(this.timer)
      this.timer2 = setInterval(() => { 
        if(this.seguir==true){
        if(this.tabed==false){
          this.segons-=1                                                              
          this.tabed=true
        }
        else{
          this.tabed=false
        }
        this.startTimer()
      }
      }, 100);
    }
  }
  startTimer() {
      clearInterval(this.timer2)
      this.timer = setInterval(() => { 
        
        this.segons = this.segons + 1;
        // console.log(this.segons);
        this.showDate() 
      }, 1000);
      
    
  }
  
  ngOnInit(): void {
    if(!this._projectService.loggedIn || !this.cookies.get("tokenid")){
      this._router.navigate(['/login'])
      console.log("ola")
    }

    // if(token==null){
    //     window.location.reload();
    // }
    this._projectService.getUser(this.UserOnline).subscribe(
        response => {
            this.maxapostables=Number(response.message.tokens)
            // console.log(this.maxapostables)
            const dialogRef = this.dialog.open(DialogExampleComponent, {
                width: '340px',
                height: '340px',
                panelClass: 'ClassDialog',
                
                data:{quantitat:this.quantitat,maxapostables:this.maxapostables}
              });
              dialogRef.afterClosed().subscribe(result => {
                  
                 this.quantitat = result;
                //  console.log(result)
                 if(result==undefined || result<0 || result==""){
                        this._router.navigate(['/home'])
                    }
                    else{
                        this.phaserGame = new Phaser.Game(this.config);
                        // this.clock = this.source.subscribe(t => {
    
                        //   this.showDate();
                        // });
                        
                      //   setInterval(() => {
                      //     this.segons = this.segons + 10;
                      //     console.log(this.segons);
                      // }, 1000);
                      const test = Array.from(document.getElementsByTagName("canvas"));
                        test.forEach((element) => {
                            console.log(element)
                            element.style.position="absolute"
                            
                        });
                      this.startTimer()
                    }
                 
              });
          //console.log(response.message.email)
          this.user = response.message
          localStorage.setItem("joc","curs")
        },
        err =>{
          if(err instanceof HttpErrorResponse){
            if(err.status===401){
              console.log(err)
              this._router.navigate(['/login'])
            }
          }
  
        }
      )
    
    
  }
}

class Game extends Phaser.Scene{
  Victoria:any
  animacions: any
  colliders: any
  coordenades: any
  blockkeys: any
  fons: any
  initialTime: any
  player: any
  gameoverImage : any
  platform1:any
  platform2:any
  platform3:any
  platform4:any
  platform5:any
  platform6:any
  platform7:any
  platform8:any
  platform9:any
  platform10:any
  platform11:any
  platform12:any
  platform13:any
  platform14:any
  platform15:any
  platform16:any
  platform17:any
  platform18:any
  platform19:any
  platform20:any
  platform21:any
  platform22:any
  platform23:any
  platform24:any
  platform25:any
  platform26:any
  platform27:any
  platform28:any
  platform29:any
  platform30:any
  platform31:any
  platform32:any
  platform33:any
  platform34:any
  platform35:any
  platform36:any
  platform37:any
  platform38:any
  platform39:any
  platform40:any
  platform41:any
  platform42:any
  platform43:any
  platform44:any
  platform45:any
  platform46:any
  platform47:any
  platform48:any
  platform49:any
  platform50:any
  platform51:any
  platform52:any
  platform53:any
  platform54:any
  platform55:any
  platform56:any
  platform57:any
  platform58:any
  platform59:any
  platform60:any
  platform61:any
  platform62:any
  platform63:any
  platform64:any
  platform65:any
  platform66:any
  platform67:any
  platform68:any
  platform69:any
  platform70:any
 
  text:any
  cursors: any
  sett:any
  seconds:any

  //bombas
  bomba:any
  bomb1x:any
  bomb1y:any
  explosio:any
  b1impact:any
  bomba2:any
  bomb2x:any
  bomb2y:any
  explosio2:any
  b2impact:any
  bomba3:any
  bomb3x:any
  bomb3y:any
  explosio3:any
  b3impact:any
  bomba4:any
  bomb4x:any
  bomb4y:any
  explosio4:any
  b4impact:any
  win: any
  token:any
  explosionaudio:any
  pasosaudio:any
  soexecutantse:boolean
  constructor(game: any){
      game = super({key:'game'});
      this.token=localStorage.getItem('token');
    //   game={key:'game'}
    //   super(game)
  }
  //quan comença
  init(){
      this.animacions= new Animacions(this);
      this.colliders= new Colliders(this);
      this.coordenades= new Coordenades(this);
      this.blockkeys=false
      this.soexecutantse=false
      // this.b1=false;
      // this.b1impact=false;
      // this.b2=false;
      // this.b2impact=false;

  }
  preload(){
      this.load.image('caza', '../assets/gamblerbomber/images/caza.png')
      this.load.image('bomba', '../assets/gamblerbomber/images/bomba.png')
      this.load.image('mort', '../assets/gamblerbomber/images/mort.png')
      this.load.image('blanc', '../assets/gamblerbomber/images/blanc.jpg')

      this.load.image('restart', '../assets/gamblerbomber/images/button.png')
      this.load.image('background', '../assets/gamblerbomber/images/bombermap.png');
      this.load.image('gameover', '../assets/gamblerbomber/images/over.png');
      this.load.image('win', '../assets/gamblerbomber/images/youwin.png');
      // this.load.image('platform', '../assets/gamblerbomber/images/red.png')
      // this.load.image('ball', '../assets/gamblerbomber/images/ball.png')
      this.load.spritesheet('player', '../assets/gamblerbomber/images/reddude.png', {
          frameWidth: 64,
          frameHeight: 64
      });
      this.load.spritesheet('explosions', '../assets/gamblerbomber/images/explosions.png', {
          frameWidth: 286,
          frameHeight: 240
      });
      this.load.audio('explosion', [ '../assets/gamblerbomber/audio/explosion.mp3' ]);
      this.load.audio('pasos', [ '../assets/gamblerbomber/audio/pasoshierba.mp3' ]);

  }
  create() {
   
      //console.log(this)
      this.physics.world.setBoundsCollision(true,true,true,true);
      // this.physics.world.bounds.width=1600
      // this.physics.world.bounds.height=1200

      this.fons= this.add.image(320, 250, 'background');
      this.cameras.main.setBounds(0,0,640,500)
        
      const anims = this.anims;
      this.animacions.create();
//       this.cameras.main.startFollow(this.player)

      this.gameoverImage=this.add.image(400,90,'gameover');
      this.gameoverImage.visible=false;
      this.gameoverImage.scale=0.1;

      this.explosionaudio = this.sound.add('explosion');
      this.explosionaudio.volume=0.05
      this.pasosaudio = this.sound.add('pasos');

      this.colliders.create();

      this.physics.add.collider(this.player,this.platform1 );
      this.physics.add.collider(this.player,this.platform2 );
      this.physics.add.collider(this.player,this.platform3 );
      this.physics.add.collider(this.player,this.platform4 );
      this.physics.add.collider(this.player,this.platform5 );
      this.physics.add.collider(this.player,this.platform6 );
      this.physics.add.collider(this.player,this.platform7 );
      this.physics.add.collider(this.player,this.platform8 );
      this.physics.add.collider(this.player,this.platform9 );
      this.physics.add.collider(this.player,this.platform10 );
      this.physics.add.collider(this.player,this.platform11 );
      this.physics.add.collider(this.player,this.platform12 );
      this.physics.add.collider(this.player,this.platform13 );
      this.physics.add.collider(this.player,this.platform14 );
      this.physics.add.collider(this.player,this.platform15 );
      this.physics.add.collider(this.player,this.platform16 );
      this.physics.add.collider(this.player,this.platform17 );
      this.physics.add.collider(this.player,this.platform18 );
      this.physics.add.collider(this.player,this.platform19 );
      this.physics.add.collider(this.player,this.platform20 );
      this.physics.add.collider(this.player,this.platform21 );
      this.physics.add.collider(this.player,this.platform22 );
      this.physics.add.collider(this.player,this.platform23 );
      this.physics.add.collider(this.player,this.platform24 );
      this.physics.add.collider(this.player,this.platform25 );
      this.physics.add.collider(this.player,this.platform26 );
      this.physics.add.collider(this.player,this.platform27 );
      this.physics.add.collider(this.player,this.platform28 );
      this.physics.add.collider(this.player,this.platform29 );
      this.physics.add.collider(this.player,this.platform30 );
      this.physics.add.collider(this.player,this.platform31 );
      this.physics.add.collider(this.player,this.platform32 );
      this.physics.add.collider(this.player,this.platform33 );
      this.physics.add.collider(this.player,this.platform34 );
      this.physics.add.collider(this.player,this.platform35 );
      this.physics.add.collider(this.player,this.platform36 );
      this.physics.add.collider(this.player,this.platform37 );
      this.physics.add.collider(this.player,this.platform38 );
      this.physics.add.collider(this.player,this.platform39 );
      this.physics.add.collider(this.player,this.platform40 );
      this.physics.add.collider(this.player,this.platform41 );
      this.physics.add.collider(this.player,this.platform42 );
      this.physics.add.collider(this.player,this.platform43 );
      this.physics.add.collider(this.player,this.platform44 );
      this.physics.add.collider(this.player,this.platform45 );
      this.physics.add.collider(this.player,this.platform46 );
      this.physics.add.collider(this.player,this.platform47 );
      this.physics.add.collider(this.player,this.platform48 );
      this.physics.add.collider(this.player,this.platform49 );
      this.physics.add.collider(this.player,this.platform50 );
      this.physics.add.collider(this.player,this.platform51 );
      this.physics.add.collider(this.player,this.platform52 );
      this.physics.add.collider(this.player,this.platform53 );
      this.physics.add.collider(this.player,this.platform54 );
      this.physics.add.collider(this.player,this.platform55 );
      this.physics.add.collider(this.player,this.platform56 );
      this.physics.add.collider(this.player,this.platform57 );
      this.physics.add.collider(this.player,this.platform58 );
      this.physics.add.collider(this.player,this.platform59 );
      this.physics.add.collider(this.player,this.platform60 );
      this.physics.add.collider(this.player,this.platform61 );
      this.physics.add.collider(this.player,this.platform62 );
      this.physics.add.collider(this.player,this.platform63 );
      this.physics.add.collider(this.player,this.platform64 );
      this.physics.add.collider(this.player,this.platform65 );
      this.physics.add.collider(this.player,this.platform66 );
      this.physics.add.collider(this.player,this.platform67 );
      this.physics.add.collider(this.player,this.platform68 );
      this.physics.add.collider(this.player,this.platform69 );
      this.physics.add.collider(this.player,this.platform70 );

//       //pilota afegir rebot i que colisioni
      this.initialTime = 15;
      this.text=this.add.text(146, 208, 'Time to move: ' + this.initialTime,{
          fontSize:'40px',
          fontFamily: 'verdana, arial, sans-serif',
        //   fill: '#FFF'
      });

      var timedEvent
      // Each 1000 ms call onEvent
      timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

        this.sett=setTimeout(() => {

          this.coordenades.create()
          this.blockkeys=true
      }, 15000); 
      this.cursors=this.input.keyboard.createCursorKeys();
      
//       $(document).ready(function(){
//           $('#boto').click(function(){
//               console.log($("#aposta").val())        
//           });
      
//           });          
  }

  formatTime(seconds:any){
      // Minutes

      var minutes = Math.floor(seconds/60);

      // Returns formated time
      this.text.setText('Time to move: ' + seconds);
  }
  onEvent(){
      if (this.initialTime>=12){
          this.initialTime -= 1; // One second
      }
      if(this.initialTime>12){
          this.formatTime(this.initialTime);
      }
      else{
          this.text.destroy()
        //   this.coordenades.create()
        //   this.blockkeys=true
      }
      
//   }
  }
  fade(alpha1:any,objecte1: any,durada:any){
    this.tweens.add({
        targets: objecte1,
        alpha: alpha1,
        duration: durada,
    })
}

  override update() {

      this.coordenades.direccio()
      
      if(this.bomba!=undefined){
          if((this.bomb1x+0.1>=this.bomba.x && this.bomb1x-0.00001<=this.bomba.x && this.bomb1y+0.1>=this.bomba.y && this.bomb1y-0.00001<=this.bomba.y) && this.b1impact==false){
              // this.bomba.disableBody(true,true)
              this.explosionaudio.play();

              this.bomba.visible=false
              //console.log("bombastaticax:"+this.bomb1x+" "+this.bomba.x)
              //console.log("bombastaticay:"+this.bomb1y+" "+this.bomba.y)
              setTimeout(() => {
                  this.explosio.y-=55
                  this.coordenades.comprovarpersonatge2(this.bomb1x,this.bomb1y)
              }, 140);
              this.explosio=this.add.sprite(this.bomb1x+4,this.bomb1y,'explosions');
              this.explosio.play("explosio",true);
              this.explosio.scale=1
              this.explosio.visible=true
              setTimeout(() => {
                this.fade(0.5,this.fons,300)
                this.win=this.add.image(310,220,'win');
                this.win.alpha=0
                this.fade(1,this.win,300)
                let executar=new Win(this.token,true)
                executar.init()

            }, 390);
              this.animacions.deleteexplosio(this.explosio) 
              //console.log("tula")
              this.b1impact=true    
            
          }        
  }
  if(this.bomba2!=undefined){
      if((this.bomb2x+0.1>=this.bomba2.x && this.bomb2x-0.00001<=this.bomba2.x && this.bomb2y+0.1>=this.bomba2.y && this.bomb2y-0.00001<=this.bomba2.y) && this.b2impact==false){
          // this.bomba2.disableBody(true,true)
          this.explosionaudio.play();

          this.bomba2.visible=false

          //console.log("bombastaticax:"+this.bomb2x+" "+this.bomba2.x)
          //console.log("bombastaticay:"+this.bomb2y+" "+this.bomba2.y)
          this.explosio2=this.add.sprite(this.bomb2x+4,this.bomb2y,'explosions');
          setTimeout(() => {
              this.explosio2.y-=55
              this.coordenades.comprovarpersonatge2(this.bomb2x,this.bomb2y)

          }, 140);
          this.explosio2.play("explosio",true);
          this.explosio2.scale=1
          this.explosio2.visible=true
          this.animacions.deleteexplosio(this.explosio2)
          this.b2impact=true
          
      }
  }
  if(this.bomba3!=undefined){
      if((this.bomb3x+0.1>=this.bomba3.x && this.bomb3x-0.00001<=this.bomba3.x && this.bomb3y+0.1>=this.bomba3.y && this.bomb3y-0.00001<=this.bomba3.y) && this.b3impact==false){
          // this.bomba3.disableBody(true,true)
          this.explosionaudio.play();
          this.bomba3.visible=false
          //console.log("bombastaticax:"+this.bomb3x+" "+this.bomba3.x)
          //console.log("bombastaticay:"+this.bomb3y+" "+this.bomba3.y)
          this.explosio3=this.add.sprite(this.bomb3x+4,this.bomb3y,'explosions');
          setTimeout(() => {
              this.explosio3.y-=55
              this.coordenades.comprovarpersonatge2(this.bomb3x,this.bomb3y)
          }, 140);
          this.explosio3.play("explosio",true);
          this.explosio3.scale=1
          this.explosio3.visible=true
          this.animacions.deleteexplosio(this.explosio3)
          this.b3impact=true 
      }
  }
  if(this.bomba4!=undefined){
      if((this.bomb4x+0.1>=this.bomba4.x && this.bomb4x-0.00001<=this.bomba4.x && this.bomb4y+0.1>=this.bomba4.y && this.bomb4y-0.00001<=this.bomba4.y) && this.b4impact==false){
          // this.bomba4.disableBody(true,true)
          this.explosionaudio.play();
          this.bomba4.visible=false
          //console.log("bombastaticax:"+this.bomb4x+" "+this.bomba4.x)
          //console.log("bombastaticay:"+this.bomb4y+" "+this.bomba4.y)
          this.explosio4=this.add.sprite(this.bomb4x+4,this.bomb4y,'explosions');
          setTimeout(() => {
              this.explosio4.y-=55
              this.coordenades.comprovarpersonatge2(this.bomb4x,this.bomb4y)
          },140);
          this.explosio4.play("explosio",true);
          this.explosio4.scale=1
          this.explosio4.visible=true
          this.animacions.deleteexplosio(this.explosio4)
          this.b4impact=true
          
      }
  }

      if (this.cursors.up.isDown && this.cursors.left.isDown && this.blockkeys==false) {
          this.anims.resumeAll();
          this.player.setVelocityY(-72);
          this.player.setVelocityX(-72);
          this.player.play("up",true);
          //console.log("siuuu")
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }

        //   this.animations1.play("up",true);
          
        //   this.animations1.y-=1;

      }
      
      else if (this.cursors.up.isDown && this.cursors.right.isDown && this.blockkeys==false) {
          this.anims.resumeAll();
              this.player.setVelocityY(-72);
              this.player.setVelocityX(72);
              this.player.play("up",true);
              if(this.soexecutantse==false){
                this.soexecutantse=true
    
                this.pasosaudio.play();
    
              }

          

//           // this.animations1.play("up",true);
          
//           // this.animations1.y-=1;

      }
      else if (this.cursors.down.isDown && this.cursors.right.isDown && this.blockkeys==false) {
          this.anims.resumeAll();
          this.player.setVelocityY(72);
          this.player.setVelocityX(72);
          this.player.play("down",true);
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }


      }
      else if (this.cursors.down.isDown && this.cursors.left.isDown && this.blockkeys==false) {
          this.anims.resumeAll();
          this.player.setVelocityY(72);
          this.player.setVelocityX(-72);
          this.player.play("down",true);
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }


      }
      else if ( this.cursors.left.isDown && this.blockkeys==false){
          // this.platform.setVelocityX(-500);
          this.anims.resumeAll();
          // this.animations1.play("left",true);
          
          this.player.setVelocityX(-145);
          this.player.setVelocityY(0);
          this.player.play("left",true);
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }


//           // this.animations1.x-=1;
      }
      else if (this.cursors.right.isDown && this.blockkeys==false) {
          // this.platform.setVelocityX(500);
          this.anims.resumeAll();
          // this.animations1.play("right",true);
          this.player.setVelocityY(0);

          this.player.setVelocityX(145);
          this.player.play("right",true);
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }

//           // this.animations1.x+=1;
      }
      else if (this.cursors.down.isDown && this.blockkeys==false) {
          this.anims.resumeAll();
          this.player.setVelocityY(145);
          this.player.setVelocityX(0);
          this.player.play("down",true);
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }


      }
      
      else if (this.cursors.up.isDown && this.blockkeys==false){
          this.anims.resumeAll();
          this.player.setVelocityY(-145);
          this.player.setVelocityX(0);
          this.player.play("up",true);
          if(this.soexecutantse==false){
            this.soexecutantse=true

            this.pasosaudio.play();

          }

          

      }
      else{
          this.pasosaudio.stop();
          this.soexecutantse=false
          this.player.setVelocityX(0);
          this.player.setVelocityY(0);

          this.player.play("left",false);
          this.player.play("right",false);
          this.player.play("down",false);
//           // this.anims.pauseAll();
      }  
   }
}

class Coordenades extends Game{
  relatedScene: any
  constructor(game:any){
      super(game)
      this.relatedScene=game
      this.relatedScene.b1=false;
      this.relatedScene.b1impact=false;
      this.relatedScene.b2=false;
      this.relatedScene.b2impact=false;
      this.relatedScene.b3=false;
      this.relatedScene.b3impact=false;
      this.relatedScene.b4=false;
      this.relatedScene.b4impact=false;
  }

  override preload(){
      

      
      this.relatedScene.load.spritesheet('player', '../../assets/gamblerbomber/images/reddude.png', {
          frameWidth: 64,
          frameHeight: 64
      });
  }
  override create(){
          this.relatedScene.caza.setVelocity(-100, 0);
          this.relatedScene.bomb1y=Phaser.Math.Between(25,475)
          this.relatedScene.bomb1x=Phaser.Math.Between(12.5,147.5)  
          this.relatedScene.bomb2y=Phaser.Math.Between(25,475)   
          this.relatedScene.bomb2x=Phaser.Math.Between(172.5,307.5)
          this.relatedScene.bomb3y=Phaser.Math.Between(25,475)
          this.relatedScene.bomb3x=Phaser.Math.Between(332.5,467.5)  
          this.relatedScene.bomb4y=Phaser.Math.Between(25,475)   
          this.relatedScene.bomb4x=Phaser.Math.Between(492.5,627.5)
  }
  
  direccio(){
      if(this.relatedScene.bomb1x+20>=this.relatedScene.caza.x && this.relatedScene.b1==false){
          this.relatedScene.b1=true
          this.relatedScene.bomba=this.relatedScene.physics.add.sprite(this.relatedScene.caza.x,180,'bomba');
          this.relatedScene.bomba.scale=0.2;
          this.relatedScene.bomba.body.allowGravity=false;

          this.relatedScene.direccioy1=this.relatedScene.bomb1y-this.relatedScene.caza.y
          this.relatedScene.direcciox1=this.relatedScene.bomb1x-this.relatedScene.caza.x
          this.relatedScene.bomba.setVelocityY(this.relatedScene.direccioy1)
          this.relatedScene.bomba.setVelocityX(this.relatedScene.direcciox1);
          this.comprovarpersonatge(this.relatedScene.bomb1x,this.relatedScene.bomb1y)

      }
      if(this.relatedScene.bomb2x+20>=this.relatedScene.caza.x && this.relatedScene.b2==false){
          this.relatedScene.b2=true
          this.relatedScene.bomba2=this.relatedScene.physics.add.sprite(this.relatedScene.caza.x,180,'bomba');
          this.relatedScene.bomba2.scale=0.2;
          this.relatedScene.bomba2.body.allowGravity=false;

          this.relatedScene.direccioy2=this.relatedScene.bomb2y-this.relatedScene.caza.y
          this.relatedScene.direcciox2=this.relatedScene.bomb2x-this.relatedScene.caza.x
          this.relatedScene.bomba2.setVelocityY(this.relatedScene.direccioy2)
          this.relatedScene.bomba2.setVelocityX(this.relatedScene.direcciox2);
          this.comprovarpersonatge(this.relatedScene.bomb2x,this.relatedScene.bomb2y)

      }
      if(this.relatedScene.bomb3x+20>=this.relatedScene.caza.x && this.relatedScene.b3==false){
          this.relatedScene.b3=true
          this.relatedScene.bomba3=this.relatedScene.physics.add.sprite(this.relatedScene.caza.x,180,'bomba');
          this.relatedScene.bomba3.scale=0.2;
          this.relatedScene.bomba3.body.allowGravity=false;

          this.relatedScene.direccioy3=this.relatedScene.bomb3y-this.relatedScene.caza.y
          this.relatedScene.direcciox3=this.relatedScene.bomb3x-this.relatedScene.caza.x
          this.relatedScene.bomba3.setVelocityY(this.relatedScene.direccioy3)
          this.relatedScene.bomba3.setVelocityX(this.relatedScene.direcciox3);
          this.comprovarpersonatge(this.relatedScene.bomb3x,this.relatedScene.bomb3y)

      }
      if(this.relatedScene.bomb4x+20>=this.relatedScene.caza.x && this.relatedScene.b4==false){
          this.relatedScene.b4=true
          this.relatedScene.bomba4=this.relatedScene.physics.add.sprite(this.relatedScene.caza.x,180,'bomba');
          this.relatedScene.bomba4.scale=0.2;
          this.relatedScene.bomba4.body.allowGravity=false;

          this.relatedScene.direccioy4=this.relatedScene.bomb4y-this.relatedScene.caza.y
          this.relatedScene.direcciox4=this.relatedScene.bomb4x-this.relatedScene.caza.x
          this.relatedScene.bomba4.setVelocityY(this.relatedScene.direccioy4)
          this.relatedScene.bomba4.setVelocityX(this.relatedScene.direcciox4);
          this.comprovarpersonatge(this.relatedScene.bomb4x,this.relatedScene.bomb4y)

      }
  }
  comprovarpersonatge(x:any ,y: any){
      //console.log("Y:"+this.relatedScene.player.y+" i "+y)
      //console.log("X:"+this.relatedScene.player.x+" i "+x)

      if((this.relatedScene.player.y<=y+80 && this.relatedScene.player.y>=y-180) && (this.relatedScene.player.x<=x+100 && this.relatedScene.player.x>=x-100)){
        //   localStorage.setItem("joc","mort")
          let win=new Win(this.token,false)
          win.init()
      }
      
  } 
  comprovarpersonatge2(x:any ,y: any){
    //console.log("Y:"+this.relatedScene.player.y+" i "+y)
    //console.log("X:"+this.relatedScene.player.x+" i "+x)

    if((this.relatedScene.player.y<=y+80 && this.relatedScene.player.y>=y-180) && (this.relatedScene.player.x<=x+100 && this.relatedScene.player.x>=x-100)){
      //   localStorage.setItem("joc","mort")
        setTimeout(() => {
            this.relatedScene.scene.start("deathscene")
         
        }, 50);
    }
    
} 
}

class Colliders extends Game{
  relatedScene: any
  constructor(game:any){
      super(game)
      this.relatedScene=game
  }
 
  override create(){ 
      //casa1
      this.relatedScene.platform1=this.relatedScene.physics.add.image(68, 60, '').setImmovable();
      this.relatedScene.platform1.body.setSize(130, 50, 50, 50);
      this.relatedScene.platform1.visible=false;
      this.relatedScene.platform1.body.allowGravity=false;

      //arbre
      this.relatedScene.platform2=this.relatedScene.physics.add.image(340, 6, '').setImmovable();
      this.relatedScene.platform2.body.setSize(20, 20, 50, 50);
      this.relatedScene.platform2.visible=false;
      this.relatedScene.platform2.body.allowGravity=false;

      //plaça
      this.relatedScene.platform3=this.relatedScene.physics.add.image(255, 80, '').setImmovable();
      this.relatedScene.platform3.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform3.visible=false;
      this.relatedScene.platform3.body.allowGravity=false;

      //arbres dreta
      this.relatedScene.platform4=this.relatedScene.physics.add.image(605, 60, '').setImmovable();
      this.relatedScene.platform4.body.setSize(30, 20, 50, 50);
      this.relatedScene.platform4.visible=false;
      this.relatedScene.platform4.body.allowGravity=false;
      
      this.relatedScene.platform5=this.relatedScene.physics.add.image(50, 130, '').setImmovable();
      this.relatedScene.platform5.body.setSize(2, 60, 50, 50);
      this.relatedScene.platform5.visible=false;
      this.relatedScene.platform5.body.allowGravity=false;

      //1ra roca
      this.relatedScene.platform6=this.relatedScene.physics.add.image(10, 228, '').setImmovable();
      this.relatedScene.platform6.body.setSize(12, 6, 50, 50);
      this.relatedScene.platform6.visible=false;
      this.relatedScene.platform6.body.allowGravity=false;

      this.relatedScene.platform7=this.relatedScene.physics.add.image(65, 195, '').setImmovable();
      this.relatedScene.platform7.body.setSize(2, 5, 50, 50);
      this.relatedScene.platform7.visible=false;
      this.relatedScene.platform7.body.allowGravity=false;

      //escala esquerra esquerra
      this.relatedScene.platform9=this.relatedScene.physics.add.image(90, 225, '').setImmovable();
      this.relatedScene.platform9.body.setSize(4, 2, 50, 50);
      this.relatedScene.platform9.visible=false;
      this.relatedScene.platform9.body.allowGravity=false;

      this.relatedScene.platform10=this.relatedScene.physics.add.image(165, 228, '').setImmovable();
      this.relatedScene.platform10.body.setSize(4, 2, 50, 50);
      this.relatedScene.platform10.visible=false;
      this.relatedScene.platform10.body.allowGravity=false;

      //2na roca
      this.relatedScene.platform11=this.relatedScene.physics.add.image(50, 351, '').setImmovable();
      this.relatedScene.platform11.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform11.visible=false;
      this.relatedScene.platform11.body.allowGravity=false;

      //3ra roca
      this.relatedScene.platform12=this.relatedScene.physics.add.image(175, 317, '').setImmovable();
      this.relatedScene.platform12.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform12.visible=false;
      this.relatedScene.platform12.body.allowGravity=false;

      //pou
      this.relatedScene.platform13=this.relatedScene.physics.add.image(343, 117, '').setImmovable();
      this.relatedScene.platform13.body.setSize(4, 6, 50, 50);
      this.relatedScene.platform13.visible=false;
      this.relatedScene.platform13.body.allowGravity=false;

      //5e arbre dalt
      this.relatedScene.platform14=this.relatedScene.physics.add.image(353, 64, '').setImmovable();
      this.relatedScene.platform14.body.setSize(3, 6, 50, 50);
      this.relatedScene.platform14.visible=false;
      this.relatedScene.platform14.body.allowGravity=false;

      //2na casa
      this.relatedScene.platform15=this.relatedScene.physics.add.image(460, 10, '').setImmovable();
      this.relatedScene.platform15.body.setSize(150, 15, 50, 50);
      this.relatedScene.platform15.visible=false;
      this.relatedScene.platform15.body.allowGravity=false;

      //2na casa maceta1
      this.relatedScene.platform16=this.relatedScene.physics.add.image(455, 25, '').setImmovable();
      this.relatedScene.platform16.body.setSize(8, 2, 50, 50);
      this.relatedScene.platform16.visible=false;
      this.relatedScene.platform16.body.allowGravity=false;

      //3ra roca
      this.relatedScene.platform17=this.relatedScene.physics.add.image(555, 25, '').setImmovable();
      this.relatedScene.platform17.body.setSize(8, 2, 50, 50);
      this.relatedScene.platform17.visible=false;
      this.relatedScene.platform17.body.allowGravity=false;

      //2 arbres dreta
      this.relatedScene.platform18=this.relatedScene.physics.add.image(590, 103, '').setImmovable();
      this.relatedScene.platform18.body.setSize(30, 30, 50, 50);
      this.relatedScene.platform18.visible=false;
      this.relatedScene.platform18.body.allowGravity=false;

      //jardi 2na casa dreta
      this.relatedScene.platform19=this.relatedScene.physics.add.image(540, 177, '').setImmovable();
      this.relatedScene.platform19.body.setSize(30, 62, 50, 50);
      this.relatedScene.platform19.visible=false;
      this.relatedScene.platform19.body.allowGravity=false;

      //2na casa dreta
      this.relatedScene.platform20=this.relatedScene.physics.add.image(600, 199, '').setImmovable();
      this.relatedScene.platform20.body.setSize(50, 80, 50, 50);
      this.relatedScene.platform20.visible=false;
      this.relatedScene.platform20.body.allowGravity=false;
      
      //2na casa dreta arbusto
      this.relatedScene.platform21=this.relatedScene.physics.add.image(560, 259, '').setImmovable();
      this.relatedScene.platform21.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform21.visible=false;
      this.relatedScene.platform21.body.allowGravity=false;

      //2 arbres dreta abaix
      this.relatedScene.platform22=this.relatedScene.physics.add.image(626, 350, '').setImmovable();
      this.relatedScene.platform22.body.setSize(10,40, 50, 50);
      this.relatedScene.platform22.visible=false;
      this.relatedScene.platform22.body.allowGravity=false;

      //esquerra escales  de baix la dreta
      this.relatedScene.platform23=this.relatedScene.physics.add.image(601, 405, '').setImmovable();
      this.relatedScene.platform23.body.setSize(10,13, 50, 50);
      this.relatedScene.platform23.visible=false;
      this.relatedScene.platform23.body.allowGravity=false;

      //baix dreta borde
      this.relatedScene.platform24=this.relatedScene.physics.add.image(628, 460, '').setImmovable();
      this.relatedScene.platform24.body.setSize(15, 40, 50, 50);
      this.relatedScene.platform24.visible=false;
      this.relatedScene.platform24.body.allowGravity=false;

      //banc esquerra de baix a la dreta
      this.relatedScene.platform25=this.relatedScene.physics.add.image(534, 450, '').setImmovable();
      this.relatedScene.platform25.body.setSize(2, 8, 50, 50);
      this.relatedScene.platform25.visible=false;
      this.relatedScene.platform25.body.allowGravity=false;
      //esquerra escales  de baix la dreta
      this.relatedScene.platform26=this.relatedScene.physics.add.image(527, 400, '').setImmovable();
      this.relatedScene.platform26.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform26.visible=false;
      this.relatedScene.platform26.body.allowGravity=false;
      //arbre dreta pou
      this.relatedScene.platform27=this.relatedScene.physics.add.image(396, 117, '').setImmovable();
      this.relatedScene.platform27.body.setSize(1, 6, 50, 50);
      this.relatedScene.platform27.visible=false;
      this.relatedScene.platform27.body.allowGravity=false;

      this.relatedScene.platform29=this.relatedScene.physics.add.image(503, 359, '').setImmovable();
      this.relatedScene.platform29.body.setSize(22, 50, 50, 50);
      this.relatedScene.platform29.visible=false;
      this.relatedScene.platform29.body.allowGravity=false;

      this.relatedScene.platform28=this.relatedScene.physics.add.image(235, 395, '').setImmovable();
      this.relatedScene.platform28.body.setSize(4, 20, 50, 50);
      this.relatedScene.platform28.visible=false;
      this.relatedScene.platform28.body.allowGravity=false;

      this.relatedScene.platform37=this.relatedScene.physics.add.image(527, 127, '').setImmovable();
      this.relatedScene.platform37.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform37.visible=false;
      this.relatedScene.platform37.body.allowGravity=false;

      this.relatedScene.platform30=this.relatedScene.physics.add.image(444, 115, '').setImmovable();
      this.relatedScene.platform30.body.setSize(1, 6, 50, 50);
      this.relatedScene.platform30.visible=false;
      this.relatedScene.platform30.body.allowGravity=false;

      this.relatedScene.platform31=this.relatedScene.physics.add.image(463, 130, '').setImmovable();
      this.relatedScene.platform31.body.setSize(1, 6, 50, 50);
      this.relatedScene.platform31.visible=false;
      this.relatedScene.platform31.body.allowGravity=false;
      
      this.relatedScene.platform32=this.relatedScene.physics.add.image(137, 65, '').setImmovable();
      this.relatedScene.platform32.body.setSize(1, 1 , 50, 50);
      this.relatedScene.platform32.visible=false;
      this.relatedScene.platform32.body.allowGravity=false;

      this.relatedScene.platform33=this.relatedScene.physics.add.image(167, 120, '').setImmovable();
      this.relatedScene.platform33.body.setSize(1, 1 , 50, 50);
      this.relatedScene.platform33.visible=false;
      this.relatedScene.platform33.body.allowGravity=false;

      this.relatedScene.platform34=this.relatedScene.physics.add.image(146, 100, '').setImmovable();
      this.relatedScene.platform34.body.setSize(36, 6, 50, 50);
      this.relatedScene.platform34.visible=false;
      this.relatedScene.platform34.body.allowGravity=false;

      this.relatedScene.platform35=this.relatedScene.physics.add.image(418, 96, '').setImmovable();
      this.relatedScene.platform35.body.setSize(1, 6, 50, 50);
      this.relatedScene.platform35.visible=false;
      this.relatedScene.platform35.body.allowGravity=false;

      this.relatedScene.platform36=this.relatedScene.physics.add.image(396, 96, '').setImmovable();
      this.relatedScene.platform36.body.setSize(1, 6, 50, 50);
      this.relatedScene.platform36.visible=false;
      this.relatedScene.platform36.body.allowGravity=false;

      //arbre
      this.relatedScene.platform38=this.relatedScene.physics.add.image(373, 46, '').setImmovable();
      this.relatedScene.platform38.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform38.visible=false;
      this.relatedScene.platform38.body.allowGravity=false;

      this.relatedScene.platform39=this.relatedScene.physics.add.image(396, 81, '').setImmovable();
      this.relatedScene.platform39.body.setSize(1, 6, 50, 50);
      this.relatedScene.platform39.visible=false;
      this.relatedScene.platform39.body.allowGravity=false;

      this.relatedScene.platform41=this.relatedScene.physics.add.image(80, 210, '').setImmovable();
      this.relatedScene.platform41.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform41.visible=false;
      this.relatedScene.platform41.body.allowGravity=false;

      this.relatedScene.platform40=this.relatedScene.physics.add.image(80, 240, '').setImmovable();
      this.relatedScene.platform40.body.setSize(2, 2, 50, 50);
      this.relatedScene.platform40.visible=false;
      this.relatedScene.platform40.body.allowGravity=false;
      //zona isla abaix
      this.relatedScene.platform42=this.relatedScene.physics.add.image(137, 434, '').setImmovable();
      this.relatedScene.platform42.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform42.visible=false;
      this.relatedScene.platform42.body.allowGravity=false;

      this.relatedScene.platform43=this.relatedScene.physics.add.image(88, 412, '').setImmovable();
      this.relatedScene.platform43.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform43.visible=false;
      this.relatedScene.platform43.body.allowGravity=false;

      this.relatedScene.platform44=this.relatedScene.physics.add.image(195, 454, '').setImmovable();
      this.relatedScene.platform44.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform44.visible=false;
      this.relatedScene.platform44.body.allowGravity=false;
      
      this.relatedScene.platform45=this.relatedScene.physics.add.image(254, 457, '').setImmovable();
      this.relatedScene.platform45.body.setSize(5, 5, 50, 50);
      this.relatedScene.platform45.visible=false;
      this.relatedScene.platform45.body.allowGravity=false;
      
      this.relatedScene.platform46=this.relatedScene.physics.add.image(263, 437, '').setImmovable();
      this.relatedScene.platform46.body.setSize(10, 10, 50, 50);
      this.relatedScene.platform46.visible=false;
      this.relatedScene.platform46.body.allowGravity=false;

      this.relatedScene.platform47=this.relatedScene.physics.add.image(243, 411, '').setImmovable();
      this.relatedScene.platform47.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform47.visible=false;
      this.relatedScene.platform47.body.allowGravity=false;

      this.relatedScene.platform48=this.relatedScene.physics.add.image(246, 364, '').setImmovable();
      this.relatedScene.platform48.body.setSize(5, 1, 50, 50);
      this.relatedScene.platform48.visible=false;
      this.relatedScene.platform48.body.allowGravity=false;

      this.relatedScene.platform49=this.relatedScene.physics.add.image(265, 329, '').setImmovable();
      this.relatedScene.platform49.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform49.visible=false;
      this.relatedScene.platform49.body.allowGravity=false;

      this.relatedScene.platform50=this.relatedScene.physics.add.image(333, 433, '').setImmovable();
      this.relatedScene.platform50.body.setSize(20, 1, 50, 50);
      this.relatedScene.platform50.visible=false;
      this.relatedScene.platform50.body.allowGravity=false;


      this.relatedScene.platform52=this.relatedScene.physics.add.image(360, 378, '').setImmovable();
      this.relatedScene.platform52.body.setSize(20, 55, 50, 50);
      this.relatedScene.platform52.visible=false;
      this.relatedScene.platform52.body.allowGravity=false;

      this.relatedScene.platform53=this.relatedScene.physics.add.image(385, 373, '').setImmovable();
      this.relatedScene.platform53.body.setSize(10, 45, 50, 50);
      this.relatedScene.platform53.visible=false;
      this.relatedScene.platform53.body.allowGravity=false;

      this.relatedScene.platform54=this.relatedScene.physics.add.image(305, 329, '').setImmovable();
      this.relatedScene.platform54.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform54.visible=false;
      this.relatedScene.platform54.body.allowGravity=false;

      this.relatedScene.platform55=this.relatedScene.physics.add.image(340, 329, '').setImmovable();
      this.relatedScene.platform55.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform55.visible=false;
      this.relatedScene.platform55.body.allowGravity=false;

      this.relatedScene.platform56=this.relatedScene.physics.add.image(370, 237, '').setImmovable();
      this.relatedScene.platform56.body.setSize(73, 30, 50, 50);
      this.relatedScene.platform56.visible=false;
      this.relatedScene.platform56.body.allowGravity=false;

      this.relatedScene.platform57=this.relatedScene.physics.add.image(235, 230, '').setImmovable();
      this.relatedScene.platform57.body.setSize(53, 50, 50, 50);
      this.relatedScene.platform57.visible=false;
      this.relatedScene.platform57.body.allowGravity=false;

      this.relatedScene.platform58=this.relatedScene.physics.add.image(191, 214, '').setImmovable();
      this.relatedScene.platform58.body.setSize(18, 44, 50, 50);
      this.relatedScene.platform58.visible=false;
      this.relatedScene.platform58.body.allowGravity=false;

      this.relatedScene.platform59=this.relatedScene.physics.add.image(257, 270, '').setImmovable();
      this.relatedScene.platform59.body.setSize(10, 10, 50, 50);
      this.relatedScene.platform59.visible=false;
      this.relatedScene.platform59.body.allowGravity=false;

      this.relatedScene.platform60=this.relatedScene.physics.add.image(393, 278, '').setImmovable();
      this.relatedScene.platform60.body.setSize(25, 10, 50, 50);
      this.relatedScene.platform60.visible=false;
      this.relatedScene.platform60.body.allowGravity=false;

      this.relatedScene.platform61=this.relatedScene.physics.add.image(442, 286, '').setImmovable();
      this.relatedScene.platform61.body.setSize(56, 33, 50, 50);
      this.relatedScene.platform61.visible=false;
      this.relatedScene.platform61.body.allowGravity=false;

      this.relatedScene.platform62=this.relatedScene.physics.add.image(393, 278, '').setImmovable();
      this.relatedScene.platform62.body.setSize(25, 10, 50, 50);
      this.relatedScene.platform62.visible=false;
      this.relatedScene.platform62.body.allowGravity=false;

      this.relatedScene.platform63=this.relatedScene.physics.add.image(393, 278, '').setImmovable();
      this.relatedScene.platform63.body.setSize(25, 10, 50, 50);
      this.relatedScene.platform63.visible=false;
      this.relatedScene.platform63.body.allowGravity=false;

      this.relatedScene.platform64=this.relatedScene.physics.add.image(480, 334, '').setImmovable();
      this.relatedScene.platform64.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform64.visible=false;
      this.relatedScene.platform64.body.allowGravity=false;

      this.relatedScene.platform64=this.relatedScene.physics.add.image(447, 430, '').setImmovable();
      this.relatedScene.platform64.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform64.visible=false;
      this.relatedScene.platform64.body.allowGravity=false;

      this.relatedScene.platform51=this.relatedScene.physics.add.image(302, 276, '').setImmovable();
      this.relatedScene.platform51.body.setSize(30, 1, 50, 50);
      this.relatedScene.platform51.visible=false;
      this.relatedScene.platform51.body.allowGravity=false;

      this.relatedScene.platform65=this.relatedScene.physics.add.image(486, 191, '').setImmovable();
      this.relatedScene.platform65.body.setSize(1, 1, 50, 50);
      this.relatedScene.platform65.visible=false;
      this.relatedScene.platform65.body.allowGravity=false;

      this.relatedScene.platform66=this.relatedScene.physics.add.image(345, 210, '').setImmovable();
      this.relatedScene.platform66.body.setSize(3, 1, 50, 50);
      this.relatedScene.platform66.visible=false;
      this.relatedScene.platform66.body.allowGravity=false;
  }
}

class Animacions extends Game{
  relatedScene: any
  constructor(game:any){
      super(game)
      this.relatedScene=game

  }
  override preload(){   
      this.relatedScene.load.spritesheet('player', '../../assets/gamblerbomber/images/reddude.png', {
          frameWidth: 64,
          frameHeight: 64
      });
  }
  override create(){
    
    //console.log(this.relatedScene)

      const anims = this.relatedScene.anims;
      this.relatedScene.anims.create({
          key:'down',
          frameRate:8,
          frames:this.relatedScene.anims.generateFrameNumbers('player', { frames: [0,1,2,3,0,1,2,3] }),
      });
      this.relatedScene.anims.create({
          key:'left',
          frameRate:8,
          frames:this.relatedScene.anims.generateFrameNumbers('player', { frames: [4,5,6,7,4,5,6,7] }),
      });
      this.relatedScene.anims.create({
          key:'right',
          frameRate:8,
          frames:this.relatedScene.anims.generateFrameNumbers('player', { frames: [8,9,10,11] }),
      });
      this.relatedScene.anims.create({
          key:'up',
          frameRate:8,
          frames:this.relatedScene.anims.generateFrameNumbers('player', { frames: [15,12,13,14,15] }),
      });
      this.relatedScene.anims.create({
          key:'explosio',
          frameRate:12,
          frames:this.relatedScene.anims.generateFrameNumbers('explosions', { frames: [1,2,3,4,5,6,7,8,9,10,11,12] }),
      });   
      this.relatedScene.player=this.relatedScene.physics.add.sprite(320,200,'player');
      this.relatedScene.player.setCollideWorldBounds(true);
      this.relatedScene.player.body.allowGravity=false;
      this.relatedScene.player.scale=0.7
 
      // this.relatedScene.explosio=this.relatedScene.add.sprite(390,250,'explosions');
      // this.relatedScene.explosio.scale=0.6
      // this.relatedScene.explosio.visible=true

      this.relatedScene.caza=this.relatedScene.physics.add.sprite(700,180,'caza');
      this.relatedScene.caza.scale=0.25;
      this.relatedScene.caza.rotation=4.7;
      this.relatedScene.caza.body.allowGravity=false;
    }
    deleteexplosio(explosio:any){
        setTimeout(() => {
            explosio.destroy()

        },740);
    }
}

class DeathScene extends Phaser.Scene{
    Game: any
    animacions: any
    colliders: any
    coordenades: any
    fons: any
    imatgemort: any
    button: any
    email:any
    token:any
    constructor(
        ){
        super({key:'deathscene'});
        this.token=localStorage.getItem('token');
    }
    //quan comença
    init(){
        
        this.animacions= new Animacions(this);
        this.colliders= new Colliders(this);
        this.coordenades= new Coordenades(this);
    }
    preload(){
        
        this.load.image('mort', '../assets/gamblerbomber/images/mort.png')
        this.load.image('background', '../assets/gamblerbomber/images/bombermap.png');
        this.load.image('restart', '../assets/gamblerbomber/images/BUTTON.png')
    
    }
    create() {
        
        
        this.fons=this.add.sprite(320, 250, 'background');
        this.fons.alpha=1
        this.fade(0.3,this.fons,2000)
        this.imatgemort=this.add.image(320, 220, 'mort');
        this.imatgemort.scale=1.3
        // this.button=this.add.sprite(320,340,'restart').setInteractive()
        // this.button.scale=0.1
        // this.button.alpha=0.6
        this.fade(0.6,this.button,300)
        this.fade(1,this.imatgemort,2000)
        setTimeout(() => {
          window.location.reload();   

      },950);

      //   this.input.on('pointerover', function (event: any, gameObjects: any) {

      //       gameObjects[0].alpha=1;
    
      //   });
    
      //   this.input.on('pointerout', function (event: any, gameObjects: any) {

      //       gameObjects[0].alpha=0.6;
    
      //   });

      //   this.button.on('pointerdown', function (this:any,event: any, gameObjects: any) {

      //       this.scene.start("game")
          

      // },this);
        
        
    }

    fade(alpha1: any,objecte1 : any, durada : any){
      this.tweens.add({
          targets: objecte1,
          alpha: alpha1,
          duration: durada,
      });
  }         
}


class Win{
    token:any
    resultat:boolean
    constructor(token:any,resultat:boolean
        
        ){
        this.token=token
        this.resultat=resultat
            
        }
    //quan comença
    init(){
        if(this.resultat==true){
            localStorage.setItem("token",this.token+"+")
        }else{
            localStorage.setItem("token",this.token+"-")
        }
        setTimeout(() => {
            localStorage.setItem("token",this.token)
            
        }, 20);

        
    }

}