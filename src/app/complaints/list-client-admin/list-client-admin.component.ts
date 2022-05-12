import { SocieteService } from './../../services/societe.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/users.service';
import { Etat } from './../../model/Etat';
import { TrelloService } from './../../services/trello.service';
import { MessageService } from './../../services/message.service';
import { CompalintService } from './../../services/compalint.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-client-admin.component.html',
  styleUrls: ['./list-client-admin.component.css']
})
export class ListClientAdminComponent implements OnInit {



  ok = true;
  public displayedColumns = ['ID', 'Subject','Type','Project', 'Submit By', 'Date', 'Status', 'details'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,
    private messageService:MessageService,
    private userService:UserService,
    private authService:AuthService,
    private societeService:SocieteService,
    private trelloService:TrelloService,
    private router:Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res=>{
      this.complaintService.getClientBySociete(res.societe).subscribe((res:any)=>{
        this.dataSource.data = res;
      })
    })
  
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
    console.log(value);
    this.dataSource.filter = value.trim().toLocaleLowerCase();
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
