import { MessageService } from './../../services/message.service';
import { StatusService } from './../../services/status.service';
import { CompalintService } from './../../services/compalint.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Etat } from 'src/app/model/Etat';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id;
 status = [];
 etats = Etat;
 s;
 sujet;
 /*data = new FormGroup({
    id: new FormControl(''),
    sujet: new FormControl('',Validators.required),
    details: new FormControl(''),
    dateCreation : new FormControl(''),
    type: new FormControl(''),
    status : new FormControl(''),
    projet: new FormControl(''),
    societe: new FormControl(''),
    developper: new FormControl(''),
    speciality: new FormControl('')
})*/
  constructor(
    @Optional() public dialogRef: MatDialogRef<EditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any,
    private compalintService:CompalintService,
    private messageService:MessageService,
  ) { 
    this.id =  complaint.complaintId;
  }

  ngOnInit(): void {
    this.status = Object.keys(this.etats);
    this.compalintService.getReclamation(this.id).subscribe(res =>{
      this.sujet = res.sujet;
      this.s = res.status
    })
  }

  update(){
    
    this.compalintService.updateStatus(this.id,this.s).subscribe( res =>{
      console.log(res);
      if(res.id){
            this.messageService.send('isAddedComplaint');
          
        Swal.fire({
          icon: 'success',
          title: 'Success...',
          text: 'Updated Successfully !',
        })
        this.OnClose();
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },err =>
     {
        Swal.fire({
          icon: 'warning',
          title: 'Updated failed!...',
          text: 'Failed',
        })
      }
    )
  }


  OnClose(){
    this.dialogRef.close();
    
  }
}
