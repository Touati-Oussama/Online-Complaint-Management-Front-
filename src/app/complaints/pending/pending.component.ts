import { Etat } from './../../model/Etat';
import { TrelloService } from './../../services/trello.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompalintService } from 'src/app/services/compalint.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  test:any;
  public displayedColumns = ['ID', 'Subject','Type','Project', 'Company Name', 'Date', 'Status','Trello', 'details', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,private route: ActivatedRoute,
              private trelloService:TrelloService,
              private userService:UserService, 
              public authService:AuthService,private router:Router) {
               }
  status = Etat.EN_COURS;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (this.authService.isAdmin())
    {
      this.complaintService.getByStatusName(this.status).subscribe((res:any)=>{
        this.dataSource.data = res;
      })
    }
    else if (this.authService.isEmployee())
    {
      this.complaintService.getByEmployeAndStaus(this.authService.loggedUser,this.status).subscribe((res:any)=>{
        this.dataSource.data = res;
      })
    }
    else if (this.authService.isClientAdmin()){
      this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res =>{
        this.complaintService.getBySocieteAndStatus(res.societe,this.status).subscribe((res:any)=>{
          this.dataSource.data = res;
        })
      })
    }

    this.trelloService.getAllcardInListDoing().subscribe(res =>{
      this.test = res;
      console.log(this.test);
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

  public doFilter = (keyword: string) => {
    //this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.complaintService.findByFilterAndStatus(keyword.trim().toLowerCase(),this.status).subscribe((res:any[])=>{
      if (res){
        this.dataSource.data = res;
      }
    })
  }


  all(){
    if(this.authService.isAdmin())
      this.router.navigate(['complaints/adminList']);
    else if (this.authService.isClientAdmin())
      this.router.navigate(['complaints/clientAdminList']);
  }

  zeroAction(){
    this.router.navigate(['complaints/zeroAction']);
  }
  closed(){
    this.router.navigate(['complaints/closed/']);
  }
  pending(){
    this.router.navigate(['complaints/pending']);
  }

  goToTrello(complaintName){
    this.trelloService.getAllcardInListDoing().subscribe((res:any[]) =>{
      this.test = res;
      res.forEach(card => {
        if(card.name == complaintName){
          //this.router.navigateByUrl(card.url);
          window.location.href= card.url;
        }
      });
    })
  }
}
