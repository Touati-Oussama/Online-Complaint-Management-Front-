import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/users.service';
import Swal from 'sweetalert2'
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,AfterViewInit  {

  data = [];
  public displayedColumns = ['firstName', 'lastName','phone','email','specialities', 'update', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private userService:UserService,private dialog:MatDialog) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(): void {
    this.userService.listStaffs().toPromise().then((res:any[])=>{
      console.log(res);
      this.dataSource.data = res;
    })
  }

  delete(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this developper ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteStaff(id).toPromise().then((res:any)=>{
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
      data: { employeeId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })   
    }
    
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}