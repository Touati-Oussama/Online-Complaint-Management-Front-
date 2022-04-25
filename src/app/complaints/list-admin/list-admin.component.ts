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
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.css']
})
export class ListAdminComponent implements OnInit {



  ok = true;
  public displayedColumns = ['ID', 'Subject','Type','Project', 'Company Name', 'Date', 'Status', 'details', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,
    private messageService:MessageService,
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
    this.complaintService.getAll().subscribe((res:any)=>{
      this.dataSource.data = res;
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

  verif(){

    this.trelloService.getAllCardInListDone().subscribe((cards:any[])=>{
      //console.log(cards);
      this.complaintService.getByStatusClosedOrPending().subscribe((complaints:any[])=>{
        //console.log(complaints);
        cards.forEach(card=>{
          complaints.forEach(compalint=>{
            if (card.name === compalint.sujet){
              if(compalint.status === Etat.EN_COURS){
                //console.log(compalint);
                this.complaintService.updateStatus(compalint.id,Etat.ClOTURE).subscribe(res=>{
                  this.messageService.send('isAddedComplaint');
                },err=>{this.ok = false})
              }
              this.trelloService.deleteCardInTrello(card.id).subscribe(res=>{
              },err=>{this.ok = false})
            }
          })
        })
      })
    })
    if(this.ok){
      Swal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Verified Successfully !',
      })
      this.ngOnInit();
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Date!',
      })
    }
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
        this.complaintService.delete(id).toPromise().then((res:any) =>{
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
}
