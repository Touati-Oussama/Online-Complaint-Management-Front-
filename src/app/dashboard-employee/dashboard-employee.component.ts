import { AuthService } from './../services/auth.service';
import { CompalintService } from 'src/app/services/compalint.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.css']
})
export class DashboardEmployeeComponent implements OnInit {

  details;
  constructor(private complaintService:CompalintService,private authService:AuthService) { }

  ngOnInit(): void {
    this.complaintService.details(this.authService.loggedUser).subscribe(res =>{
      console.log(res);
      this.details = res;
    })
  }

}
