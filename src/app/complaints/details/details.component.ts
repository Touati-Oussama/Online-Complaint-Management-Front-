import { ForwardComponent } from './../forward/forward.component';
import { TrelloService } from './../../services/trello.service';
import { FileService } from './../../services/file.service';
import { ClientDetailsComponent } from './../client-details/client-details.component';
import { LoginComponent } from './../../login/login.component';
import { AuthService } from 'src/app/services/auth.service';
import { CompalintService } from './../../services/compalint.service';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  id;
  file:any
  data : any;
  constructor(private route:ActivatedRoute,
              private router:Router,
              private dialog:MatDialog,
              public authService:AuthService,
              public dialogRef: MatDialogRef<DetailsComponent>,
              private fileService:FileService,
              private trelloService:TrelloService,
              @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any,
              private complaintService:CompalintService) { 
                this.id = complaint.complaintId;
              }

  ngOnInit(): void {
    //const id = this.route.snapshot.params.id;
    this.complaintService.getReclamation(this.id).toPromise().then((res:any)=>{
      this.data = res;
    })
    this.fileService.getBySfe(this.id).subscribe(res =>{
      this.file = res;
    })
    
  }

  viewClient(){
    const dialogRef = this.dialog.open(ClientDetailsComponent,{
      width : "40%",
      height: "50%",
      data: { complaintId: this.id, companyName : this.data.societe}
    });

 
  }

  download(id){
    this.fileService.getBySfe(this.id).subscribe(res =>{
        this.fileService.downloadFile(id)
        .subscribe(data => {
          saveAs(new Blob([data], {type: MimeType['application/vnd.openxmlformats-officedocument.wordprocessingml.document']}), res.name);
        })
    })
  }

  takeAction(){
      const dialogRef = this.dialog.open(EditComponent,{
        width : "40%",
        height: "50%",
        data: { complaintId: this.id}
      });
  }

  forward(complaintName){
    this.dialog.closeAll();
    this.router.navigate(['complaints/forward/'+this.id+'/'+complaintName]);
  }

  forwardTest(){
    let dialogRef;
    this.complaintService.getReclamation(this.id).toPromise().then((res:any)=>{
      this.data = res;
        dialogRef = this.dialog.open(ForwardComponent,{
        width : "50%",
        height: "70%",
        data: { complaint: res}
      });
    })
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }
}
