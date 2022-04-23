import { StatusService } from './../../services/status.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  id;
  data = new FormGroup(
    {
      status: new FormControl('',[Validators.required]),
      id: new FormControl('',[Validators.required]),
      dateCreation: new FormControl('',[Validators.required])
    }
  )
  constructor(
    public dialogRef: MatDialogRef<EditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public status: any,
    private statusService:StatusService, private route:ActivatedRoute, private router:Router) {
        this.id = status.statusId;
     }

  ngOnInit(): void {
    /*const id = this.route.snapshot.params.id;
    console.log(id);*/

    this.statusService.getStatus(this.id).toPromise().then((res:any)=>{
      console.log(res);
      this.data.setValue(res);
    })
  }

  update(){
    //const id = this.route.snapshot.params.id;
    this.statusService.update(this.data.value,this.id).toPromise().then((res:any)=>{
      if (res.id) {
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
        text: 'Something went wrong!, plase try again',
      })
    })
  }

  OnClose(){
    this.dialogRef.close();
    
  }
}
