import { Role } from './../../model/Role';
import { MessageService } from './../../services/message.service';
import { FileService } from './../../services/file.service';
import { UserService } from 'src/app/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { CompalintService } from './../../services/compalint.service';
import { TypeService } from 'src/app/services/types.service';
import { ProjetService } from 'src/app/services/projet.service';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  selectedFiles: File [];
  currentFile: File;
  progress = -1;
  message = '';
  fileInfos: Observable<any>;
  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  projects = [];
  types = [];
  idProject:any;
  project:any;
  data = new FormGroup({
    sujet: new FormControl('',Validators.required),
    details: new FormControl('',Validators.required),
    type: new FormControl('',Validators.required),
    projet: new FormControl(''),
    client: new FormControl(''),

  })
  constructor(private projectService: ProjetService,
              private authService:AuthService,
              private typeService:TypeService,
              private userService:UserService,
              private fileService:FileService,
              private messageService:MessageService,
              private complaintService:CompalintService,
              @Optional() public dialogRef: MatDialogRef<AddComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any) {
                if(complaint != null)
                  this.idProject = complaint.projectId;
               }

  ngOnInit(): void {
      if (this.idProject){
        this.projectService.getProjet(this.idProject).toPromise().then((res:any)=>{
          this.project = res;
        })
      }
      else{

        this.userService.getCustomerByUsername(this.authService.loggedUser).toPromise().then((res:any)=>{
          
          this.projectService.getProjectsBySocietyName(res.societe).toPromise().then((res:any)=>{
            this.projects = res;
          
        })
        })
      }
      
      this.typeService.listeType().toPromise().then((res:any[])=>{
        this.types = res;
        //console.log(this.types);
      })

      
  }


  submit(){

    console.log(this.selectedFiles)
    /*//const idProject = this.route.snapshot.params.id;
    if(!this.data.value['projet'])
    this.data.patchValue({projet: this.idProject});
    this.data.patchValue({ client: this.authService.loggedUser })
    //console.log(this.data.value);
    this.progress = 0;
    if(this.selectedFiles){
      this.currentFile = this.selectedFiles.item(0);
      this.fileService.upload(this.currentFile).subscribe((res:any ) =>{
      if (res){
        console.log(res);
        console.log(res.body.id);
        this.data.addControl('file',new FormControl(res.body.id,[]));
        console.log(this.data.value);
        this.complaintService.add(this.data.value).subscribe((res:any)=>{
          this.messageService.send('isAddedComplaint');
          if (res.type == HttpEventType.UploadProgress){
            this.progress = Math.round(100 * res.loaded / res.total);
          }
          else if (res instanceof HttpResponse){
            if (res.body.id) {
              this.messageService.send('isAddedComplaint');
              Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Added Successfully !',
              })  
              this.selectedFiles = undefined;
              this.data.reset();
              this.progress = -1;
              try {
                this.onClose();
              } catch (error) {}

            }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
            }
          }
        })
      }
      },
        err => {
          this.progress = -1;
          this.message = 'Could not upload the file!';
          this.currentFile = undefined;
        });
    }
    else
    {
      this.data.addControl('image', new FormControl(null,[]));
      console.log(this.data.value);
      this.complaintService.add(this.data.value).subscribe((res:any)=>{
        this.messageService.send('isAddedComplaint');
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * res.loaded / res.total);
        }
        else if (res instanceof HttpResponse) {
          if (res.body.id) {
            this.messageService.send('isAddedComplaint');
            this.selectedFiles = undefined;
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Added Successfully !',
            })  
            this.data.reset();
            this.onClose();
            this.progress = -1;
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            })
          }
        }

      })
    }*/
    
    //const idProject = this.route.snapshot.params.id;
    if(!this.data.value['projet'])
      //this.data.setValue({projet: idProject})
      this.data.patchValue({
        projet: this.idProject
      });
    this.data.patchValue({ client: this.authService.loggedUser })
    this.progress = 0;
    if(this.selectedFiles){
      this.complaintService.add(this.data.value).subscribe((res:any)=>{
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * res.loaded / res.total);
        }
        else if (res instanceof HttpResponse) {
          if (res.body.id) {
            this.messageService.send('isAddedComplaint');
            this.fileService.uploadd(this.selectedFiles,res.body.id).subscribe((res:any) => {
              if (res){
                this.selectedFiles = undefined;
                Swal.fire({
                  icon: 'success',
                  title: 'Success...',
                  text: 'Ajouté avec succès!',
                })  
                this.data.reset();
                this.onClose();
                this.progress = -1;
              }
            })

          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Quelque chose s'est mal passé!",
            })
          }
        }
        /*if (res.body.id) {
          this.fileService.uploadd(this.selectedFiles,res.body.id).subscribe((res:any) => {
              
              if (res.type === HttpEventType.UploadProgress) {
                console.log("progressss");
                this.progress = Math.round(100 * res.loaded / res.total);
              } else if (res instanceof HttpResponse) {
                this.message = res.body.message;
              }
            },
            err => {
              this.progress = 0;
              this.message = 'Could not upload the file!';
            });
          this.selectedFiles = undefined;
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Added Successfully !',
          })  
          this.data.reset();
          this.onClose();
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
        }*/
      })
    }
    else
    {
      this.complaintService.add(this.data.value).subscribe((res:any)=>{
        this.messageService.send('isAddedComplaint');
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * res.loaded / res.total);
        }
        else if (res instanceof HttpResponse) {
          if (res.body.id) {
            this.messageService.send('isAddedComplaint');
            this.selectedFiles = undefined;
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Ajouté avec succès!',
            })  
            this.data.reset();
            this.onClose();
            this.progress = -1;
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Quelque chose s'est mal passé!",
            })
          }
        }
      })
    }
    

    }

    onClose(){
      
      this.dialogRef.close();
    }
}

