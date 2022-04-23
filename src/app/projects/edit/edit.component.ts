import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjetService } from 'src/app/services/projet.service';
import { UserService } from 'src/app/services/users.service';
import { SpecialtyService } from 'src/app/services/specialty.service';
import Swal from 'sweetalert2';
import { SocieteService } from 'src/app/services/societe.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  societies = [];
  specialities = [];
  id;
  data = new FormGroup({
    id: new FormControl('',Validators.required),
    designation: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    societe: new FormControl('',Validators.required),
    specialite: new FormControl('',Validators.required)
  })
  constructor(
      private societeService:SocieteService,
      private specialiteService: SpecialtyService,
      private projetService:ProjetService,
      public dialogRef: MatDialogRef<EditComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public project: any) { 
        this.id = project.projectId;
      }

  ngOnInit(): void {
    this.societeService.listeSocieties().toPromise().then((res:any[])=>{
      this.societies = res;
      console.log(res);
    })
    this.specialiteService.listeSpecialties().toPromise().then((res:any) =>{
      this.specialities = res;
    })


    this.projetService.getProjet(this.id).toPromise().then((res:any)=>{
      console.log(res);
      this.data.setValue(res);
    })
  }


  update(){
    this.projetService.update(this.data.value,this.id).toPromise().then((res:any)=>{
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

