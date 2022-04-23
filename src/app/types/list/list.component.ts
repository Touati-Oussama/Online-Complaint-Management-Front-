
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TypeService } from 'src/app/services/types.service';
import Swal from 'sweetalert2'
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit,AfterViewInit {

  data$: any;
  public displayedColumns = ['ID', 'Type', 'update', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private typeService:TypeService,private dialog:MatDialog) {
   }
  
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.GetAll();
    this.typeService.Refreshrequired.subscribe(response =>{
      this.GetAll();
    })
  }

  GetAll(){
    this.typeService.listeType().subscribe(res=>{
      this.data$ = res;
      console.log(this.data$);
      this.dataSource.data = this.data$;
    })
  }

  delete(id:number){
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this type ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      this.typeService.delete(id).toPromise().then((res:any)=>{
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
    //disableClose: true
  });
  /*dialogRef.afterClosed().subscribe(res =>{
    this.ngOnInit();
  })  */ 
}

update(id){
  const dialogRef = this.dialog.open(EditComponent,{
    width : "40%",
    height: "40%",
    //disableClose: true,
    data: { typeId: id}
  });
  dialogRef.afterClosed().subscribe(res =>{
    this.ngOnInit();
  })   
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}

