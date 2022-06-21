import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CompalintService } from '../services/compalint.service';

@Component({
  selector: 'app-dashboard-customer',
  templateUrl: './dashboard-customer.component.html',
  styleUrls: ['./dashboard-customer.component.css']
})
export class DashboardCustomerComponent implements OnInit {

  constructor(private complaintService:CompalintService,private authService:AuthService,) { }
  data;
  ngOnInit(): void {
    this.complaintService.detailsParClient(this.authService.loggedUser).subscribe(res=>{
      this.data = res;
    })
  }

}
