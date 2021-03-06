import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../complaints/add/add.component';
import { UserService } from '../services/users.service';
import { EditComponent } from '../customers/edit/edit.component';

@Component({
  selector: 'app-navbar-client',
  templateUrl: './navbar-client.component.html',
  styleUrls: ['./navbar-client.component.css']
})
export class NavbarClientComponent implements OnInit {

  id:number;
  constructor(public authService:AuthService,private userService:UserService,private dialog:MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.userService.getUserByUsername(this.authService.loggedUser).subscribe(res =>{
      this.id = res.user_id;
      
    })


  }


  
  onLogout(){
    this.authService.logout();
  }

  goToChat(){
    this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe((res:any)=>{
      console.log(res);
      this.router.navigate(['chatroom/'+res.societe]);
    })
  }

}
