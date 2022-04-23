import { MessageService } from './../services/message.service';
import { AppComponent } from './../app.component';
import { ImageService } from './../services/image.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  user = new User();
  imageBlobUrl: any= null;
  err:number = 0;
  constructor(private authService : AuthService,
    private messageService:MessageService,
    public router: Router) { }
  

  ngOnInit(): void {
  }

  onLoggedin()
  {
    let res = 0;
    this.authService.login(this.user).subscribe((data)=>{
      let jwToken = data.headers.get('Authorization');
      this.authService.saveToken(jwToken);
      this.messageService.send('isAuthenticated');
      if (this.authService.isAdmin()){
        this.router.navigate(['/dashboard-admin']);       
      }      
      else if(this.authService.isEmployee()){
        this.router.navigate(['/dashboard-employee']);
      }
      else if(this.authService.isClient()){
        this.router.navigate(['/dashboard-customer']);
      }

    },(err) =>{
    this.err = 1;
    });

  }


}
