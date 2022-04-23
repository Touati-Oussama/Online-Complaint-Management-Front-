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
 data = new FormGroup({
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
})
  constructor(
    @Optional() public dialogRef: MatDialogRef<EditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any,
    private compalintService:CompalintService,
    private messageService:MessageService,
    private statusService:StatusService
  ) { 
    this.id =  complaint.complaintId;
  }

  ngOnInit(): void {
    /*this.statusService.listeStatus().subscribe( res =>{
       this.status = res;
       console.log(res);
      });*/
      //console.log(this.etats);
    this.status = Object.keys(this.etats);
    this.compalintService.getReclamation(this.id).subscribe(res =>{
      try {
        this.data.setValue(res);
      } catch (error) {
        
      }
    })
  }

  update(){
    let status = this.data.value['status'];
    this.compalintService.updateStatus(this.id,status).subscribe( res =>{
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
