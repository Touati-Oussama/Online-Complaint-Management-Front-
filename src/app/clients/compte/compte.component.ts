import { Account } from './../../model/Account';
import { UserService } from 'src/app/services/users.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CompalintService } from 'src/app/services/compalint.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {

 id;
 enabled;
 status = [];
 etats = Account;

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<CompteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public user: any,
    private userService:UserService,
  ) { this.id = user.id }

  ngOnInit(): void {
    this.status = Object.keys(this.etats);
    this.userService.getUser(this.id).subscribe(res =>{this.enabled = res.enabled})


  }

  update(){
    console.log(this.enabled);
    this.userService.updateCompteStatus(this.id,this.enabled).subscribe( res =>{
      if(res.user_id){
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
