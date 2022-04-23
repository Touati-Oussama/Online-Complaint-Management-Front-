
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TypeService } from 'src/app/services/types.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  data:FormGroup;
  successMsg='';
  errorMsg='';
  constructor(private typeService:TypeService,public dialogRef: MatDialogRef<AddComponent>) { }

  ngOnInit(): void {
    this.data = new FormGroup(
      {
        type: new FormControl('',[Validators.required])
      }
    )
  }
  add(){
    console.log(this.data.value);
    this.typeService.add(this.data.value).toPromise().then((res:any)=>{
      if (res.type_id) {
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
