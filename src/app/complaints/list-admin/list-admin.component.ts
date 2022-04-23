import { Etat } from './../../model/Etat';
import { TrelloService } from './../../services/trello.service';
import { MessageService } from './../../services/message.service';
import { Status } from './../../model/Status';
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
    this.router.navigate(['complaints/closed/'+0]);
  }
  pending(){
    this.router.navigate(['complaints/pending/'+0]);
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
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Date!',
      })
    }
  }
}
