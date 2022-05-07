import { CompteComponent } from './../compte/compte.component';
import { Role } from './../../model/Role';
import { MatPaginator } from '@angular/material/paginator';
import { ProjetService } from './../../services/projet.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';
import { AddComponent } from '../add/add.component';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,AfterViewInit {

  data = [];
  public displayedColumns = ['firstName', 'lastName','phone','email','companyName','status', 'update', 'Edit status'];
  public dataSource = new MatTableDataSource();

  constructor(private userService:UserService,private dialog:MatDialog,
              public authService:AuthService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(): void {
    this.userService.getCustomerByUsername(this.authService.loggedUser).toPromise().then(res=>{
      this.userService.listCustomersBySociete(res.societe).toPromise().then((res:any[])=>{
        console.log(res);
        this.dataSource.data = res;
        this.data = res;
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

  /*delete(id: number){
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this customer ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteCustomers(id).toPromise().then((res:any)=>{
          if (res){
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Deleted Successfully !',
            })
            this.ngOnInit();
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            })
          }
        },
        err =>{
          Swal.fire({
            icon: 'warning',
            title: 'Deleted failed!...',
            text: err.error.message,
          })
        }
        )
      }
    }
    )
  }*/

  doFilter(keyword){
    this.userService.getCustomerByUsername(this.authService.loggedUser).toPromise().then(res=>{
      this.userService.listCustomersBySocieteAndFilter(res.societe,keyword).toPromise().then((res:any[])=>{
        console.log(res);
        this.dataSource.data = res;
        this.data = res;
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
  ModifierCompte(id: number){
    const dialogRef = this.dialog.open(CompteComponent,{
      width : "40%",
      height: "50%",
      data: { id: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }

  /*public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }*/

  add(){
    const dialogRef = this.dialog.open(AddComponent,{
      width : "40%",
      height: "80%",
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }

  update(id){
    const dialogRef = this.dialog.open(EditComponent,{
      width : "40%",
      height: "80%",
      data: { customerId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })   
    }
}