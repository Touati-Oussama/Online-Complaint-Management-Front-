import { StatusService } from './../../services/status.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  data:FormGroup;
  constructor(private statusService:StatusService,
              public dialogRef: MatDialogRef<AddComponent>) { }

  ngOnInit(): void {
    this.data = new FormGroup(
      {
        status: new FormControl('',[Validators.required])
      }
    )
  }

  add(){
    console.log(this.data.value);
    this.statusService.add(this.data.value).toPromise().then((res:any)=>{
      if (res.id) {
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
        text: 'Something went wrong!, Please try again !',
      })
    })

    }

    OnClose(){
      this.dialogRef.close();
      
    }
  

}
