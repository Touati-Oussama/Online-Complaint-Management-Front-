import { SpecialtyService } from './../../services/specialty.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
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
export class ListComponent implements OnInit,AfterViewInit{

  data = [];
  public displayedColumns = ['ID', 'Speciality','Team Number', 'update', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private specialityService: SpecialtyService,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.specialityService.listeSpecialties().toPromise().then((res:any[])=>{
      this.dataSource.data = res;
      console.log(res);
    })
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }



  delete(/*specialite:String,*/id:number){
    console.log(id);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer cette spécialité ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.specialityService.delete(id).toPromise().then((res:any)=>{
          if (res){
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Supprimé avec succès !',
            })
            this.ngOnInit();
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Quelque chose s'est mal passé!",
            })
          }
        },
        err =>{
          Swal.fire({
            icon: 'warning',
            title: 'La suppression a échoué!...',
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
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }

  update(id){
    const dialogRef = this.dialog.open(EditComponent,{
      width : "40%",
      height: "40%",
      //disableClose: true,
      data: { specialityId: id}
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