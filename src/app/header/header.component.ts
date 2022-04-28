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
  private subscription:Subscription;
  private SubscriptionComplaint:Subscription;
  constructor (public authService: AuthService,
    private imageService:ImageService,
    private messageService:MessageService,
    private complaintService:CompalintService,
    private stompService:StompService,
    private router: Router) {

    }
  status = 'EN_ATTENTE ';
  ngOnInit(): void {
    this.loadImage();
    this.loadComplaints();
    this.stompService.subscribe('/topic/New Complaint',() : void =>{
      this.loadComplaints();
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: ` ${this.nb} new complaint(s)`,

      })
    })
    this.subscription = this.messageService.getMessage().subscribe(res=>{
      if (res.message === 'isAuthenticated'){
        this.loadImage();
        this.loadComplaints();
      }
      else if  (res.message === 'isAddedComplaint'){
        this.loadComplaints();
      }
    });    
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
    this.complaintService.getByStatusName(Etat.EN_ATTENTE).subscribe((res:any)=>{
      this.data = res;
      if(this.data)
        this.nb = this.data.length;
    })
  }

}
