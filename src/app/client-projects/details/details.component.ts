import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProjetService } from 'src/app/services/projet.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddComponent } from 'src/app/complaints/add/add.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  data;
  id;
  constructor(private projetService:ProjetService,
              private route:ActivatedRoute,
              public authService:AuthService,
              private router:Router,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<DetailsComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public project: any
              ) {
                this.id = project.projectId;
                console.log(this.id);
              }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    console.log(this.id)
    this.projetService.getProjet(this.id).toPromise().then((res:any)=>{
      console.log(res);
      this.data = res;
    },
    err =>{
      Swal.fire({
        icon: 'error',
        title: err.error.message,
        text: 'Access Denied',
      })
    })
  }

  add(id){
    //this.router.navigate(['complaints/add/' + id]);
    console.log(id);
    const dialogRef = this.dialog.open(AddComponent,{
      width : "40%",
      height: "82%",
      //disableClose: true,
      data: { projectId: id}
    });
    dialogRef.afterClosed().subscribe(res =>{

      /*this.userService.getCustomerByUsername(this.authService.loggedUser).toPromise().then((res:any)=>{
        console.log(res);
        this.society = res.societe;
        this.projetService.getProjectsBySocietyName(res.societe).toPromise().then((res:any)=>{
          this.data = res;
        },
        err =>{
          Swal.fire({
            icon: 'error',
            title: err.error.message,
            text: 'Access Denied',
          })
        })
      })*/
    }) 

  }
  retour(){
    this.router.navigate(['client/projects']);
  }
  return(){
    this.router.navigate(['projects']);
  }
}
