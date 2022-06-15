import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompalintService } from 'src/app/services/compalint.service';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  complain: any;
  progress = -1;
  data = new FormGroup({
    reply: new FormControl('', Validators.required),
    id: new FormControl(''),
  })
  constructor(
    @Optional() public dialogRef: MatDialogRef<ReplyComponent>,
    private complaintService: CompalintService,
    private messageService:MessageService,
    @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any,
  ) {
    this.complain = complaint;
    this.data.patchValue({id:this.complain.complaint.id});
   }

  ngOnInit(): void {
    
  }
  reply(){
    console.log(this.data.value);
    this.complaintService.reply(this.data.value).subscribe((res:any)=>{
      console.log(res);
      this.messageService.send('isAddedComplaint');
      if (res.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * res.loaded / res.total);
      }
      else if (res instanceof HttpResponse) {
        if (res.body.id) {
          this.messageService.send('isAddedComplaint');
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Repondre avec succès!',
          })  
          this.data.reset();
          this.onClose();
          this.progress = -1;
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Quelque chose s'est mal passé!",
          })
        }
      }
    })
  }

  
  onClose(){
      
    this.dialogRef.close();
  }
}
