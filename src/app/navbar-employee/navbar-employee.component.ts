import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-navbar-employee',
  templateUrl: './navbar-employee.component.html',
  styleUrls: ['./navbar-employee.component.css']
})
export class NavbarEmployeeComponent implements OnInit {

  id;
  constructor(private authService:AuthService,private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getUserByUsername(this.authService.loggedUser).subscribe(res =>{
      this.id = res.user_id;
      console.log(this.id);
    })
  }

  onLogout(){
    localStorage.removeItem('nickname');
    this.authService.logout();
  }
}
