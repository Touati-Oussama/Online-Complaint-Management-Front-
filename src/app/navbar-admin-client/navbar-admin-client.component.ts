import { UserService } from './../services/users.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar-admin-client',
  templateUrl: './navbar-admin-client.component.html',
  styleUrls: ['./navbar-admin-client.component.css']
})
export class NavbarAdminClientComponent implements OnInit {


  id:number;
  constructor(private authService:AuthService,private userService:UserService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.userService.getUserByUsername(this.authService.loggedUser).subscribe(res =>{
      this.id = res.user_id
    })
  }

  onLogout(){
    this.authService.logout();
  }
}
