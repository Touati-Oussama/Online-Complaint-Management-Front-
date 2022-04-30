import { StompService } from './../services/stomp-service.service';
import { Etat } from './../model/Etat';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CompalintService } from '../services/compalint.service';
import { ImageService } from '../services/image.service';
import { MessageService } from '../services/message.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  file: File;
  retrievedImage: any;
  base64Data: any;
  data = [];
  nb:number;
  retrieveResonse: any;
  verifToken : boolean = true;
  path:any;
  private subscription:Subscription;
  private SubscriptionComplaint:Subscription;
  constructor (public authService: AuthService,
    private imageService:ImageService,
    private messageService:MessageService,
    private complaintService:CompalintService,
    private stompService:StompService,
    private router: Router) {
  
    }
  ngOnInit(): void {
    this.loadImage();
    this.loadComplaints();
    this.subscription = this.messageService.getMessage().subscribe(res=>{
      if (res.message === 'isAuthenticated'){
        this.loadImage();
        this.loadComplaints();
        if (this.authService.isAdmin() || this.authService.isEmployee())
          if (this.nb > 0)
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: ` ${this.nb} new complaint(s)`,
      
            })
      }
      else if  (res.message === 'isAddedComplaint'){
        this.loadComplaints();
      }
    });  
    if (this.authService.isAdmin())
    this.path = "New Complaint";
   if (this.authService.isEmployee())
     this.path = "Forward Complaint";
   this.stompService.subscribe('/topic/'+this.path,() : void =>{
     this.loadComplaints();
     if (this.authService.isAdmin())
     this.nb++;
     Swal.fire({
       icon: 'warning',
       title: 'Warning',
       text: ` ${this.nb} new complaint(s)`,

     })
   })  
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadImage(){
    this.imageService.getImage(this.authService.loggedUser).subscribe((res)=>{
      if (res != null)
      {
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.data;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    })
  }
  loadComplaints(){
    if (this.authService.isAdmin())
      this.complaintService.getByStatusName(Etat.EN_ATTENTE).subscribe((res:any)=>{
        this.data = res;
        if(this.data)
          this.nb = this.data.length;
      })
    if (this.authService.isEmployee())
      this.complaintService.getByEmployeAndStaus(this.authService.loggedUser,Etat.EN_COURS).subscribe((res:any)=>{
        this.data = res;
        if(this.data)
          this.nb = this.data.length;
      })
  }
  go(){
    if (this.authService.isAdmin())
    this.router.navigate(["complaints/zeroAction"])
    if (this.authService.isEmployee())
    this.router.navigate(["complaints/pending"])
  }

}
