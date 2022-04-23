import { UserService } from 'src/app/services/users.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SpecialtyService } from 'src/app/services/specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { ImageService } from 'src/app/services/image.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos: Observable<any>;
  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }
  
  specialitiess = [];
  data:FormGroup;
  id;
  constructor(  private fb: FormBuilder,
                private specialiteService:SpecialtyService,
                private userService:UserService,
                private imageService:ImageService,private messageService:MessageService,
                @Optional() public dialogRef: MatDialogRef<EditComponent>,
                @Optional() @Inject(MAT_DIALOG_DATA) public employe: any,
                private route:ActivatedRoute, private router:Router
              )
                 {
                   if (employe)
                      this.id = employe.employeeId
                  }

  ngOnInit(): void {
    this.data = this.fb.group({
      id: new FormControl('',[Validators.required]),
      nom: new FormControl('',[Validators.required]),
      prenom: new FormControl('',[Validators.required]),
      username: new FormControl('',[Validators.required]),
      telephone: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      specialites: this.fb.array([],[Validators.required])
    });
      this.specialiteService.listeSpecialties().toPromise().then((res:any[])=>{
      this.specialitiess = res;
    })
    if(!this.id)
      this.id = this.route.snapshot.params.id;
    this.userService.getStaff(this.id).toPromise().then((res:any)=>{
      this.data.setValue(res);

    })
    
  }

  onCheckboxChange(e:any){
    const specialites: FormArray = this.data.get('specialites') as FormArray;
    if(e.target.checked){
      specialites.push(new FormControl(e.target.value));
    }  
  }
  
  update(){
    this.progress = 0;
    if (this.selectedFiles){
      this.currentFile = this.selectedFiles.item(0);
      this.imageService.update(this.id,this.currentFile).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } 
          else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.userService.updateTeams(this.data.value,this.id).toPromise().then((res:any)=>{
              console.log(res);
              if(res.user_id){
                this.messageService.send('isAuthenticated');
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
            },
            err => {
              Swal.fire({
                icon: 'warning',
                title: 'Updated  failed!...',
                text: err.error.message,
              })
            })
          }
        })
    }
    else{
      this.userService.updateTeams(this.data.value,this.id).toPromise().then((res:any)=>{
        console.log(res);
        if(res.user_id){
          this.messageService.send('isAuthenticated');
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
      },
      err => {
        Swal.fire({
          icon: 'warning',
          title: 'Updated  failed!...',
          text: err.error.message,
        })
      })
    }

  }

  OnClose(){
    this.dialogRef.close();
    
  }
}


