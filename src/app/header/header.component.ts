import { UserService } from 'src/app/services/users.service';
import { IInboxConversation } from './../model/InboxConversationModel';
import { InboxService } from './../services/inbox.service';
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
import { IInboxMessage } from '../model/IInboxMessage';
import { User } from '../model/User';

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
  inboxMessages: IInboxMessage[] = [];
  inboxNewMessages: IInboxMessage[] = [];
  nb:number;
  nbMessages:number;
  retrieveResonse: any;
  verifToken : boolean = true;
  path:any;
  oldMessages: IInboxMessage[] = [];
  newMessages: IInboxMessage[] = [];
  currentUser = new User();
  private subscription:Subscription;
  private SubscriptionComplaint:Subscription;
  constructor (public authService: AuthService,
    private imageService:ImageService,
    private messageService:MessageService,
    private userService:UserService,
    private complaintService:CompalintService,
    private stompService:StompService,
    private inboxService:InboxService,
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
          if (this.data.length > 0)
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: `Nouveaux Réclamation(s)`,
      
            })
            
      }
      else if  (res.message === 'isAddedComplaint'){
        this.loadComplaints();
      }
      else if (res.message === 'updateHeader'){
        this.nbMessages = 0;
        this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe((res:any)=>{
          this.inboxService.update(res.societe).subscribe((con:IInboxConversation)=>{
          })
        })

      }
    });  
    if (this.authService.isAdmin())
      this.path = "New Complaint";
   if (this.authService.isEmployee())
     this.path = "Forward Complaint";
    this.stompService.subscribe('/topic/'+this.path,() : void =>{
      this.loadComplaints();
      if (this.authService.isAdmin() || this.authService.isEmployee() )
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text:  'Nouveaux Réclamation(s)',

      })
   })


   if(this.authService.isPersonnel_Societe()){
    this.stompService.subscribe('/topic/new Message',() : void =>{
      this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe((res:any)=>{
        this.loadAll(res.societe);
  
        
        /*this.inboxService.update(res.societe).subscribe((con:IInboxConversation)=>{
          console.log(con)
        })*/
      })
      
      
    })
   }


  }

  loadAll(roomname){
    this.inboxService.findAll().subscribe((res:IInboxConversation[])=>{
      res.forEach(r=>{
        if (r.subject === roomname){
            this.getMessagesByConversation(r);
        }
        return;
      })
    })
  }
  
  getMessagesByConversation(inboxConversation: IInboxConversation): void {
    this.newMessages = [];
    this.inboxMessages = [];
    this.inboxNewMessages = [];
    this.inboxService.getMessages(inboxConversation.id).subscribe(messages => {
      this.inboxMessages = messages;
      console.log(this.inboxMessages);
      this.inboxService.findBySociete(inboxConversation.subject).subscribe((con:any)=>{
        console.log(con.nbMsg);
        //this.inboxNewMessages = this.inboxMessages.slice(res.nbMsg,this.inboxMessages.length);
        this.userService.getUserByUsername(this.authService.loggedUser).subscribe((res:any)=>{
          let user = new User();
          user.id  = res.user_id;
          user.email = res.email;
          this.currentUser = user;
          this.newMessages = this.inboxMessages.slice(con.nbMsg);
          console.log(this.newMessages);
          this.newMessages.forEach(msg=>{
            if(msg.fromId != this.currentUser.id)
              this.inboxNewMessages.push(msg);
          })
  
            console.log(this.inboxNewMessages);
            this.nbMessages = this.inboxNewMessages.length;
        })
      })
      this.inboxService.interceptCount();
     
    });
    /*this.inboxService.update(inboxConversation.subject).subscribe((res)=>{
      //console.log(res);
    })*/
  }

  goToChat(){
    this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe((res:any)=>{
      //console.log(res);
      this.nbMessages = 0;
      this.inboxService.update(res.societe).subscribe((res)=>{
        //console.log(res);
      })
      this.router.navigate(['chatroom/'+res.societe]);

    })
  }
  onLogout(){
    this.userService.updateUserStatus(this.authService.loggedUser,false).subscribe((res)=>{ });
    //this.messageService.send('isAuthenticated');
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