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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  id;
  file = [];
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
    this.fileService.getByComplaint(this.id).subscribe(res =>{
      this.file = res;
      console.log(res);
    })
    
  }

  viewClient(){
    const dialogRef = this.dialog.open(ClientDetailsComponent,{
      width : "40%",
      height: "50%",
      data: { complaintId: this.id, companyName : this.data.societe}
    });

 
  }

  download(id,fileName){
    this.fileService.downloadFile(id).subscribe(data => {
          saveAs(new Blob([data], {type: MimeType['application/vnd.openxmlformats-officedocument.wordprocessingml.document']}), fileName);
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
      })
      dialogRef = this.dialog.open(ForwardComponent,{
      width : "50%",
      height: "70%",
      data: { complaint: this.data}
    })

    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }

  delete(id:number){
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer ce réclamation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !'
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
