import { TypeService } from './../../services/types.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  data = new FormGroup(
    {
      type: new FormControl('',[Validators.required]),
      type_id: new FormControl('',[Validators.required]),
    })
    id;
  constructor(private route:ActivatedRoute, private router:Router,
              public dialogRef: MatDialogRef<EditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public type: any,
              private typeService:TypeService) {
                this.id = type.typeId
               }
  
  ngOnInit(): void {
    //const id = this.route.snapshot.params.id;
    this.typeService.getType(this.id).toPromise().then((res:any)=>{
      console.log(res);
      this.data.setValue(res);
    })
  }

  update(){
    //const id = this.route.snapshot.params.id;
    this.typeService.update(this.data.value,this.id).toPromise().then((res:any) =>{
      if (res.type_id) {
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
