import { SpecialtyService } from './../../services/specialty.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {


  data:FormGroup;
  constructor(private specialtyService:SpecialtyService,public dialogRef: MatDialogRef<AddComponent>) { }

  ngOnInit(): void {
    this.data = new FormGroup(
      {
        nom: new FormControl('',[Validators.required])
      }
    )
  }

  add(){
    console.log(this.data.value);
    this.specialtyService.add(this.data.value).toPromise().then((res:any)=>{
      if (res.spec_id) {
        Swal.fire({
          icon: 'success',
          title: 'Success...',
          text: 'Added Successfully !',
        })
        this.data.reset();
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
