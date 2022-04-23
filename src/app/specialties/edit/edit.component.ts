import { ActivatedRoute, Router } from '@angular/router';
import { SpecialtyService } from './../../services/specialty.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  specialite;
  id;
  data = new FormGroup(
    {
      nom: new FormControl('',[Validators.required]),
    }
  )
  constructor(
              private specialtyService: SpecialtyService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public speciality: any,
            )
            { 
              this.id = speciality.specialityId;
            }

  ngOnInit(): void {


    this.specialtyService.getSpecialty(this.id).toPromise().then((res:any)=>{
      console.log(res);
      this.specialite = res.specialite;
      console.log(this.specialite);
    })
  }

  update(){
    
    this.specialtyService.update(this.data.value,this.id).toPromise().then((res:any)=>{
      console.log(res);
      if (res.spec_id) {
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
    }).catch((err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message,
      })
    })
  }

  OnClose(){
    this.dialogRef.close();
    
  }
}
