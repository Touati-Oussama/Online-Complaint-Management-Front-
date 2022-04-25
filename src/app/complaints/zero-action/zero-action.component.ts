import { ImageService } from './../../services/image.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompalintService } from 'src/app/services/compalint.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-zero-action',
  templateUrl: './zero-action.component.html',
  styleUrls: ['./zero-action.component.css']
})
export class ZeroActionComponent implements OnInit {

  public displayedColumns = ['ID', 'Subject','Type','Project', 'Company Name', 'Date', 'Status', 'details', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,private router:Router) { }
  status = 'EN_ATTENTE ';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.complaintService.getByStatusName(this.status).subscribe((res:any)=>{
      console.log(res);
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
  all(){
    this.router.navigate(['complaints/adminList']);
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
}
