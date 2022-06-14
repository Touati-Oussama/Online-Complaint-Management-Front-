import { StompService } from './../../services/stomp-service.service';
import { SocieteService } from 'src/app/services/societe.service';


import { ProjetService } from './../../services/projet.service';
import { TypeService } from './../../services/types.service';
import { Etat } from './../../model/Etat';
import { TrelloService } from './../../services/trello.service';
import { MessageService } from './../../services/message.service';
import { CompalintService } from './../../services/compalint.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { Filter } from 'src/app/model/filter';
import { Complaint } from 'src/app/model/Complaint';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.css']
})
export class ListAdminComponent implements OnInit {



  types = [];
  projects = [];
  societes = [];
  status: string[]=[Etat.EN_ATTENTE,Etat.EN_COURS,Etat.ClOTURE];
  defaultValue = "tous";
  filterDictionary= new Map<string,string>();
  ok = true;
  filters: Filter[]=[];
  public displayedColumns = ['id', 'sujet','type','project', 'societe', 'date', 'status', 'details', 'delete'];
  public dataSource = new MatTableDataSource();
  constructor(private complaintService:CompalintService,private dialog:MatDialog,
    private messageService:MessageService,
    private typeService:TypeService,
    private projetService:ProjetService,
    private societeService:SocieteService,
    private stompService:StompService,
    private trelloService:TrelloService,
    private router:Router) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.getAll();
    this.stompService.subscribe('/topic/New Complaint',() : void =>{
      this.getAll();
    })
    this.loadProjects();
    this.loadTypes();
    this.loadSociete();
    this.loadFilters();
  }

  loadProjects(){
    this.projetService.getAll().subscribe((res:any[]) =>{
      res.forEach(p =>{
        this.projects.push(p.designation);
      })
    })
  }

  loadTypes(){
    this.typeService.listeType().subscribe((res:any[]) =>{
      res.forEach(t =>{
        this.types.push(t.type);
      })
    })
    }
    
  loadSociete(){
    this.societeService.listeSocieties().subscribe((res:any[]) =>{
      res.forEach(s =>{
        this.societes.push(s.name);
      })
    })
  }

  getAll(){

      this.complaintService.getAll().subscribe((res:any[])=>{
        this.dataSource.data = res;
      })
      this.dataSource.filterPredicate = function (record,filter) {
        debugger;
        var map = new Map(JSON.parse(filter));
        let isMatch = false;
        for(let [key,value] of map){
          isMatch = (value=="tous") || (record[key as keyof Complaint] == value); 
          if(!isMatch) return false;
        }
        return isMatch;
      }
    }

  loadFilters(){
    this.filters.push({name:'projet',options:this.projects,defaultValue:this.defaultValue});
    this.filters.push({name:'type',options:this.types,defaultValue:this.defaultValue});
    this.filters.push({name:'societe',options:this.societes,defaultValue:this.defaultValue});
    this.filters.push({name:'status',options:this.status,defaultValue:this.defaultValue});
  }

  applyEmpFilter(ob:MatSelectChange,filter:Filter) {

    this.filterDictionary.set(filter.name,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
      //console.log(this.filterValues);
    }
  
  details(id){
    const dialogRef = this.dialog.open(DetailsComponent,{
      width : "60%",
      height: "70%",
      //disableClose: true,
      data: { complaintId: id}
    });   
    dialogRef.afterClosed().subscribe(res =>{
      this.filters =[];
      this.ngOnInit();
    })  
  }

  public doFilter = (keyword: string) => {
    //this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.complaintService.findByFilter(keyword.trim().toLowerCase()).subscribe((res:any[])=>{
      if (res){
        this.dataSource.data = res;
      }
    })
  }

  onChangeStatus($event:any){
   
   this.complaintService.getByStatusName($event.value).subscribe((res:any[])=>{
      this.dataSource.data = res;
   })

  }

  
  onChangeType($event:any){
    this.complaintService.findByType($event.value).subscribe((res:any)=>{
      this.dataSource.data = res;
    })
  }

  onChangeProject($event:any){
    this.complaintService.findByProjet($event.value).subscribe((res:any)=>{
      this.dataSource.data = res;
    })
  }

  zeroAction(){
    this.router.navigate(['complaints/zeroAction']);
  }
  closed(){
    this.router.navigate(['complaints/closed/']);
  }
  pending(){
    this.router.navigate(['complaints/pending/']);
  }

  verif(){

    this.projetService.getAll().toPromise().then((res:any [])=>{
      res.forEach(r=>{
        this.trelloService.getBoardByProjet(r.designation).subscribe((res:any)=>{
          this.trelloService.getAllCardInListDone(res.idListDone).subscribe((cards:any[])=>{
            //console.log(cards);
            this.complaintService.getByStatusClosedOrPending().subscribe((complaints:any[])=>{
              //console.log(complaints);
              cards.forEach(card=>{
                complaints.forEach(compalint=>{
                  if (card.name === compalint.sujet){
                    if(compalint.status === Etat.EN_COURS){
                      //console.log(compalint);
                      this.complaintService.updateStatus(compalint.id,Etat.ClOTURE).subscribe(res=>{
                        this.messageService.send('isAddedComplaint');
                      },err=>{this.ok = false})
                    }
                  }
                })
              })
            })
          })
        })
      })
      if(this.ok){
        Swal.fire({
          icon: 'success',
          title: 'Success...',
          text: 'Toutes les réclamations sont verifiées !',
        })
        this.filters =[];
        this.ngOnInit();
  
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid Date!',
        })
      }
    })
  }

  delete(id:number){
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer ce réclamation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.complaintService.delete(id).toPromise().then((res:any) =>{
          if (res){
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Supprimé avec succès !',
            })
            this.ngOnInit();
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Quelque chose s'est mal passé!",
            })
          }
        },
        err =>{
          Swal.fire({
            icon: 'warning',
            title: 'Échec de la suppression!...',
            text: err.error.message,
          })
        }
        )
      }
    }
    )
  }

}
