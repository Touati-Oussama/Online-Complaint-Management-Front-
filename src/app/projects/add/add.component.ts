import { SocieteService } from './../../services/societe.service';
import { ProjetService } from './../../services/projet.service';
import { UserService } from 'src/app/services/users.service';
import { SpecialtyService } from 'src/app/services/specialty.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  societies = [];
  specialities = [];
  data = new FormGroup({
    designation: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    societe: new FormControl('',Validators.required),
    specialite: new FormControl('',Validators.required)
  })
  constructor(private societeService:SocieteService,
    public dialogRef: MatDialogRef<AddComponent>,
     private specialiteService: SpecialtyService,
    private projetService:ProjetService) { }

  ngOnInit(): void {
    this.societeService.listeSocieties().toPromise().then((res:any[])=>{
      this.societies = res;
      console.log(res);
    })
    this.specialiteService.listeSpecialties().toPromise().then((res:any) =>{
      this.specialities = res;
    })


  }

  add(){
    console.log(this.data.value);
    this.projetService.add(this.data.value).toPromise().then((res:any)=>{
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
        text: err.error.message,
      })
    })

    }

    OnClose(){
      this.dialogRef.close();
      
    }
}
