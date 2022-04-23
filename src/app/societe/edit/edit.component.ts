import { SocieteService } from './../../services/societe.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
      name: new FormControl('',[Validators.required]),
      id: new FormControl('',[Validators.required]),
    }
  )
  id;
  constructor(
              public dialogRef: MatDialogRef<EditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public society: any,
              private router:Router,  
              private societeService:SocieteService
            ) 
              {
                  this.id = society.societyId;
              }

  ngOnInit(): void {
    this.societeService.getSociety(this.id).toPromise().then((res:any)=>{
      console.log(res);
      this.data.setValue(res);
    })
  }


  update(){
    this.societeService.update(this.data.value,this.id).toPromise().then((res:any)=>{
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
        text: err.error.message,
      })
    })
  }

  OnClose(){
    this.dialogRef.close();
    
  }
}
