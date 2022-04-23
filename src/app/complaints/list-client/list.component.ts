import { AuthService } from 'src/app/services/auth.service';
import { CompalintService } from '../../services/compalint.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private authService:AuthService,private complaintService:CompalintService,private dialog:MatDialog,) { }

  public displayedColumns = ['ID', 'Name', 'Type','Project', 'Date', 'Status', 'Details'];
  public dataSource = new MatTableDataSource();
  data = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.complaintService.getByClientUsername(this.authService.loggedUser).toPromise().then((res:any[])=>{
      console.log(res);
      this.dataSource.data = res;
    })
  }

  details(id){
    const dialogRef = this.dialog.open(DetailsComponent,{
      width : "40%",
      height: "60%",
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
}
