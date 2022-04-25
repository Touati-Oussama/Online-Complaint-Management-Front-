import { TrelloService } from './services/trello.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './services/image.service';
import { SharedService } from './services/shared.service';
import { Subscription } from 'rxjs';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'solutionCRM';
  file: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  verifToken : boolean = true;
  private subscription:Subscription;

  constructor (public authService: AuthService,
    private messageService:MessageService,
    private router: Router) {

    }


  ngOnInit(): void {
    this.authService.loadToken();
    this.subscription = this.messageService.getMessage().subscribe(res=>{
      if (res.message === 'isAuthenticated'){
        console.log(this.authService.getToken());
      }
    });  

    if (this.authService.getToken()==null || this.authService.isTokenExpired())
      this.router.navigate(['/login']);
  }

  onLogout(){
    this.authService.logout();
  }





}
