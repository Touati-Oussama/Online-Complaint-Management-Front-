import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompalintService } from 'src/app/services/compalint.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.css']
})
export class ClosedComponent implements OnInit {

  
  public displayedColumns = ['ID', 'Subject','Type','Project', 'Company Name', 'Date', 'Status', 'details', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,
               private router:Router,public authService:AuthService) { }
  status = 'ClOTURE';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    if (this.authService.isAdmin())
    {
      this.complaintService.getByStatusName(this.status).subscribe((res:any)=>{
        this.dataSource.data = res;
      })
    }
    else if (this.authService.isEmployee())
    {
      this.complaintService.getByEmployeAndStaus(this.authService.loggedUser,this.status).subscribe((res:any)=>{
        this.dataSource.data = res;
      })
    }

  }

  details(id){
    const dialogRef = this.dialog.open(DetailsComponent,{
      width : "50%",
      height: "70%",
      //disableClose: true,
      data: { complaintId: id}
    });   
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  all(){
    this.router.navigate(['complaints/adminList']);
  }

  zeroAction(){
    this.router.navigate(['complaints/zeroAction']);
  }
  closed(){
    this.router.navigate(['complaints/closed']);
  }
  pending(){
    this.router.navigate(['complaints/pending/']);
  }

}
