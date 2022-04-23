import { SpecialtyService } from './../../services/specialty.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos: Observable<any>;
  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }
  
  durationInSeconds = 5;
  data:FormGroup;
  specialitiess = [];
  constructor(private userService:UserService,
              private fb: FormBuilder,
              private imageService:ImageService,
              public dialogRef: MatDialogRef<AddComponent>,
              private specialiteService:SpecialtyService) {

               }

  ngOnInit(): void {

    this.specialiteService.listeSpecialties().toPromise().then((res:any[])=>{
      this.specialitiess = res;
    })
    this.data = this.fb.group({
      nom: new FormControl('',[Validators.required]),
      prenom: new FormControl('',[Validators.required]),
      username: new FormControl('',[Validators.required]),
      telephone: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      specialites: this.fb.array([Validators.required])
    })
  }

  onCheckboxChange(e:any){
    const specialites: FormArray = this.data.get('specialites') as FormArray;
    if(e.target.checked){
      specialites.push(new FormControl(e.target.value));
    }  
  }
  add(){
    this.currentFile = this.selectedFiles.item(0);
    this.imageService.uploadd(this.currentFile).subscribe(res =>{
      if (res){
        console.log(res.body.id);
        this.data.addControl('image', new FormControl(res.body.id,[]));
        console.log(this.data.value);
        this.userService.addStaff(this.data.value).subscribe((res:any)=>{
          if (res.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * res.loaded / res.total);
          }
          else if (res instanceof HttpResponse){
            if (res.body.user_id) {
              this.progress = 0;
              Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Your registration is successful!',
              })
              this.data.reset();
              this.currentFile = undefined;
              try {
                if(this.dialogRef.getState())
                this.OnClose();
              } catch (error) {} 
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
            }
          }
        },
        err => {
          Swal.fire({
            icon: 'warning',
            title: 'Signup failed!...',
            text: err.error.message,
          })
          this.currentFile = undefined;
          }
    
        )
      }
    })

    
  }

  OnClose(){
    this.dialogRef.close();      
  }
}
