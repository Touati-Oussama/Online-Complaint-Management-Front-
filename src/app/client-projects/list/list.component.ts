import { AddComponent } from './../../complaints/add/add.component';
import { UserService } from './../../services/users.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProjetService } from 'src/app/services/projet.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,AfterViewInit {

  public displayedColumns = ['ID', 'Name', 'Domain', 'Date', 'Details', 'Add'];
  public dataSource = new MatTableDataSource();
  data = [];
  society;
  constructor(private projetService:ProjetService,private authService:AuthService,
              private userService:UserService,
              private dialog:MatDialog) { }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.userService.getCustomerByUsername(this.authService.loggedUser).toPromise().then((res:any)=>{
     // console.log(res);
      this.society = res.societe;
      this.projetService.getProjectsBySocietyName(res.societe).toPromise().then((res:any)=>{
        this.dataSource.data = res;
      },
      err =>{
        Swal.fire({
          icon: 'error',
          title: err.error.message,
          text: 'Access Denied',
        })
      })
    })

  }

  add(id){
    //this.router.navigate(['complaints/add/' + id]);
    console.log(id);
    const dialogRef = this.dialog.open(AddComponent,{
      width : "40%",
      height: "82%",
      //disableClose: true,
      data: { projectId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    }) 

  }

  details(id){
    console.log(id);
    const dialogRef = this.dialog.open(DetailsComponent,{
      width : "40%",
      height: "60%",
      data: { projectId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
