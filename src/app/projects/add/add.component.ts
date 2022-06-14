import { TrelloDB } from './../../model/Trello';
import { TrelloService } from './../../services/trello.service';
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
  trelloDB:TrelloDB = new TrelloDB;
  societies = [];
  specialities = [];
  data = new FormGroup({
    designation: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    societe: new FormControl('',Validators.required),
    specialite: new FormControl('',Validators.required)
  })

  TrelloData = new FormGroup({
    idBoard: new FormControl('',Validators.required),
    idListToDo: new FormControl('',Validators.required),
    idListDoing: new FormControl('',Validators.required),
    idListDone: new FormControl('',Validators.required),
    projet: new FormControl('',Validators.required)
  })
  constructor(private societeService:SocieteService,
    public dialogRef: MatDialogRef<AddComponent>,
    private trelloService:TrelloService,
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
    this.projetService.add(this.data.value).toPromise().then((projet:any)=>{
      if (projet.id) {
        this.trelloService.addBoard(projet.designation).subscribe((board:any)=>{
          this.trelloService.getBoardList(board.id).subscribe((res:any[])=>{
            res.forEach(r=>{
              if (r.name == "To Do")
                this.TrelloData.patchValue({idListToDo: r.id})
              if (r.name == "Doing")
                this.TrelloData.patchValue({idListDoing: r.id})
              if (r.name == "Done")
                this.TrelloData.patchValue({idListDone: r.id})
            })
            this.TrelloData.patchValue({idBoard: board.id})
            this.TrelloData.patchValue({projet: projet.id})
            console.log(this.TrelloData.value)
            this.projetService.addTrello(this.TrelloData.value).toPromise().then((res:any)=>{
              if (res.id){
                Swal.fire({
                  icon: 'success',
                  title: 'Success...',
                  text: 'Ajouté avec succès !',
                })
                this.data.reset();
                this.OnClose();
              }
            })
          })
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Quelque chose s'est mal passé!",
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
