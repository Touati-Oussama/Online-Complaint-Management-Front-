import { StompService } from './../../services/stomp-service.service';
import { MessageService } from './../../services/message.service';
import { AuthService } from './../../services/auth.service';
import { Etat } from './../../model/Etat';
import { ImageService } from './../../services/image.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompalintService } from 'src/app/services/compalint.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { Observable, Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-zero-action',
  templateUrl: './zero-action.component.html',
  styleUrls: ['./zero-action.component.css']
})
export class ZeroActionComponent implements OnInit {
  private subscription:Subscription;
  public displayedColumns = ['ID', 'Subject','Type','Project', 'Company Name', 'Date', 'Status', 'details', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,
    private userService:UserService, 
    private messageService:MessageService,
    private stompService:StompService,
    private router:Router,public authService:AuthService) { }
  status = Etat.EN_ATTENTE;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.loadComplaints();
    this.stompService.subscribe('/topic/New Complaint',() : void =>{
      this.loadComplaints();  
    })
     
  }

  loadComplaints(){
    if(this.authService.isAdmin())
      this.complaintService.getByStatusName(Etat.EN_ATTENTE).subscribe((res:any)=>{
        console.log(res);
        this.dataSource.data = res;
      })
    else if (this.authService.isClientAdmin()){
      this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res =>{
        console.log(res);
        this.complaintService.getBySocieteAndStatus(res.societe,this.status).subscribe((res:any)=>{
          this.dataSource.data = res;
          console.log(res);
        })
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
  public doFilter = (keyword: string) => {
    //this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.complaintService.findByFilterAndStatus(keyword.trim().toLowerCase(),this.status).subscribe((res:any[])=>{
      if (res){
        this.dataSource.data = res;
      }
    })
  }
  
  all(){
    if(this.authService.isAdmin())
      this.router.navigate(['complaints/adminList']);
    else if (this.authService.isClientAdmin())
      this.router.navigate(['complaints/clientAdminList']);
  }

  zeroAction(){
    this.router.navigate(['complaints/zeroAction']);
  }
  closed(){
    this.router.navigate(['complaints/closed/']);
  }
  pending(){
    this.router.navigate(['complaints/pending/']);
  }
}
