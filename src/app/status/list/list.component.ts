import { StatusService } from './../../services/status.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Status } from 'src/app/model/Status';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,AfterViewInit {

  data = [];
  public displayedColumns = ['ID', 'Status','Date', 'update', 'delete'];
  public dataSource = new MatTableDataSource();

  constructor(private statusService: StatusService,private dialog:MatDialog) {}


  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.statusService.listeStatus().toPromise().then((res:any[])=>{
      this.dataSource.data = res;
    })
   
  }

  delete(id:number){
    //console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this status ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.statusService.delete(id).toPromise().then((res:any)=>{
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
      height: "40%",
      
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })   
  }

  update(id){
    const dialogRef = this.dialog.open(EditComponent,{
      width : "40%",
      height: "40%",
      //disableClose: true,
      data: { statusId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })   
  }
  
  
  public doFilter = (event) => {

    const filterValue = (event.target as HTMLInputElement).value 
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
