import { AuthService } from 'src/app/services/auth.service';
import { DetailsComponent } from './../../client-projects/details/details.component';
import { Router } from '@angular/router';
import { ProjetService } from './../../services/projet.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,AfterViewInit {

  data = [];
  public displayedColumns = ['ID', 'Name', 'Society', 'Domain', 'Details', 'Update', 'Delete'];
  public dataSource = new MatTableDataSource();
  constructor(private projetService:ProjetService,public authService:AuthService,private dialog:MatDialog) { }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.projetService.getAll().toPromise().then((res:any)=>{
      this.dataSource.data = res;
    },
    err =>{
      Swal.fire({
        icon: 'error',
        title: err.error.message,
        text: 'Access Denied',
      })
    })
  }

  delete(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this project ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetService.delete(id).toPromise().then((res:any) =>{
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
  }



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
      this.ngOnInit();  
      }

      public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
      }
}
