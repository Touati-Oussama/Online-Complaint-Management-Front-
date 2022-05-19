import { UserService } from './../services/users.service';
import { MessageService } from './../services/message.service';
import { AppComponent } from './../app.component';
import { ImageService } from './../services/image.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Form } from '../model/Form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  user = new User();
  imageBlobUrl: any= null;
  err:number = 0;
  ref;
  constructor(private authService : AuthService,
    private messageService:MessageService,
    private userService:UserService,
    private db: AngularFireDatabase,
    public router: Router) {
      this.ref = this.db.database.ref('users/');
     }
  

  ngOnInit(): void {
  }

  onLoggedin()
  {
    let res = 0;
    this.authService.login(this.user).subscribe((data)=>{
      let jwToken = data.headers.get('Authorization');
      this.authService.saveToken(jwToken);
      this.messageService.send('isAuthenticated');
      
      this.userService.getUserByUsername(this.authService.loggedUser).subscribe((res:any)=>{
        let title = '';
        if (this.authService.isAdmin())
          title = 'Responsable GPRO';
        if (this.authService.isEmployee())
          title = 'Personnel GPRO';
        if (this.authService.isPersonnel_Societe())
          title = 'Personnel Societe';
        let nickname = res.nom + " " + res.prenom;
        this.ref.orderByChild('nickname').equalTo(nickname).once('value', snapshot => {
          if (snapshot.exists()) {
            localStorage.setItem('nickname',nickname);
          } else {
            let form:Form = new Form();
            const newUser = this.db.database.ref('users/').push();
            /*newUser.set(nickname);
            newUser.set(title);*/
            form.nickname = nickname;
            form.title = title;
            newUser.set(form);
            localStorage.setItem('nickname',nickname);
          }
        });
      })
      if (this.authService.isAdmin()){
        this.router.navigate(['/dashboard-admin']);       
      }      
      else if(this.authService.isEmployee()){
        this.router.navigate(['/dashboard-employee']);
      }
      else if(this.authService.isResponsable_Societe()){
        this.router.navigate(['/dashboard-customer-admin']);
      }
      else if(this.authService.isPersonnel_Societe()){
        this.router.navigate(['/dashboard-customer']);
      }
      
 
    },(err) =>{
    this.err = 1;
    });

  }


}
