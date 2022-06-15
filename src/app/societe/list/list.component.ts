import { AddComponent } from './../add/add.component';
import { SocieteService } from './../../services/societe.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  data = [];
  public displayedColumns = ['ID', 'Society','Manager','Team Number', 'update', 'delete'];
  public dataSource = new MatTableDataSource();


  constructor(private societeService:SocieteService,private dialog:MatDialog) { }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {

    this.societeService.listeSocieties().toPromise().then((res:any[])=>{
      this.dataSource.data = res;
    })
  }

  delete(id:number){
    //console.log(id);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer cette société ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.societeService.delete(id).toPromise().then((res:any)=>{
          if (res){
            Swal.fire({
              icon: 'success',
              title: 'Succès...',
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
            title: 'Échec de la suppression!...',
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
      data: { societyId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{
     this.ngOnInit();
    })   
    }

    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
}
