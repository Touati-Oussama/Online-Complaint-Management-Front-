import { AddroomComponent } from './../addroom/addroom.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/users.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import * as firebase from 'firebase';
import {ToastrService} from 'ngx-toastr';
import {ReplaySubject, Subscription} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
//import {FormatDateService} from '../../shared/services/format-date.service';
import * as fileSaver from 'file-saver';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { InboxService } from '../services/inbox.service';
import { User } from '../model/User';
import { IInboxMessage, InboxMessageModel } from '../model/IInboxMessage';
import { IInboxConversation, InboxConversationModel } from '../model/InboxConversationModel';
import { IInboxParticipant, InboxParticipantModel } from '../model/InboxParticipantModel';
import { MatDialog } from '@angular/material/dialog';
import { StompService } from '../services/stomp-service.service';

@Component({
  selector: 'app-inbox-list',
  templateUrl: './inbox-list.component.html',
  styleUrls: ['./inbox-list.component.css']
})
export class InboxListComponent implements OnInit, OnDestroy {

  @ViewChild('addConversationModal') addConversationModal: ElementRef;

  message: string;
  messageFormControl = new FormControl();
  inboxConversations: IInboxConversation[] = [];
  selectConversation = false;
  inboxMessages: IInboxMessage[] = [];
  inboxConversation = new InboxConversationModel();
  currentUser = new User();
  active = false;
  subscriptions: Subscription[] = [];
  loading = false;
  searchFormControl = new FormControl();
  roleMap = new Map();

  // Popup
  selectedParticipantsIds: string[] = [];
  participantCtrl: FormControl = new FormControl();
  participantFilteringCtrl: FormControl = new FormControl();
  filteredParticipants: ReplaySubject<InboxParticipantModel[]> = new ReplaySubject<InboxParticipantModel[]>(1);
  participants: InboxParticipantModel[] = [];
  inboxConversationModal = new InboxConversationModel();
  isValid = true;

  isFirstSended = false;
  selectConversationId: any;
  currentConversation: IInboxConversation;

  photoSrc =  'api/documents-download/';
  errorFileTooLarge: boolean;
  selectedFiles: FileList;
  currentFileUpload: File;
  reader = new FileReader();

  constructor(
    private toaster: ToastrService,
    private inboxService: InboxService,
    private db: AngularFireDatabase,
    private dialog:MatDialog,
    private modal: NgbModal,
    private activeModal: NgbActiveModal,
    private stompService:StompService,
    private userImplService: UserService,
    private authService:AuthService,
    //private formatDateService: FormatDateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    /*this.subscriptions.push(this.inboxService.sharedNewMessage.subscribe(newMessage => {
      if (newMessage) {
        this.loadAll();
        if (this.inboxConversation.id) {
          this.getMessagesByConversation(this.inboxConversation);
        }
      }
    }));*/

    this.stompService.subscribe('/topic/new Message',() : void =>{
      this.loadAll();
      if (this.inboxConversation.id) {
        this.getMessagesByConversation(this.inboxConversation);
      }
    })

    //this.currentUser = this.getCurrentUser();
    this.userImplService.getUserByUsername(this.authService.loggedUser).subscribe((res:any)=>{
      let user = new User();
      user.id  = res.user_id;
      user.email = res.email;
      this.currentUser = user;
    })
    
    this.setRoleMap();
    this.loadAll();
    this.getParticipantsForMatSelectSearch();

  }

  sendMessage(): void {
    /*let message = new InboxMessageModel();
    message.message = this.messageFormControl.value;
    message.inboxConversationId = this.inboxConversation.id;
    message.fromId = this.currentUser.id;*/

    this.userImplService.getUserByUsername(this.authService.loggedUser).subscribe((res:any)=>{
      if (res){
        let message = new InboxMessageModel();
        message.message = this.messageFormControl.value;
        message.inboxConversationId = this.inboxConversation.id;
        message.fromId = res.user_id;

        console.log(message);

        this.inboxService.sendMessage(message).subscribe(msg => {


          //this.notify();
          this.inboxConversations.forEach(conversation => {
            if (conversation.id === this.inboxConversation.id) {
              conversation.lastInBoxMessage = msg;
              conversation.lastModifiedDate = msg.sendDate;
            }
          });
          if (!this.isFirstSended) {
            this.loadAll()
            this.isFirstSended = true;
          }
          this.selectConversationId = msg.inboxConversationId
          if (this.currentFileUpload) {
            console.log(msg);
            this.inboxService.uploadMessageFile(this.currentFileUpload, msg.id).subscribe(value => {
              this.getMessagesByConversation(this.inboxConversation);
              this.messageFormControl.reset();
              this.currentFileUpload = null;
            })
          } else {
            this.getMessagesByConversation(this.inboxConversation);
            this.messageFormControl.reset();
          }
    
        });
      }
    })

  }

  notify() {
    this.currentConversation.participants.forEach(participant => {
      const chat = {receiver: '', sender: '', type: ''};
      chat.type = 'message';
      //chat.receiver = participant.id;
      chat.sender = this.currentUser.id;
      const newMessage = this.db.database.ref(chat.receiver + '/messages').push();
      newMessage.set(chat);
    })
  }

  addConversation() {
    this.activeModal = this.modal.open(this.addConversationModal, {centered: true});
    this.isValid = true;
    this.inboxConversationModal.subject = '';
    this.selectedParticipantsIds = [];
    this.inboxConversationModal.participants = [];
  }


  loadAll(): void {
    this.loading = true;
    this.inboxService.findAll().subscribe(inboxConversations => {
      this.loading = false;
      this.inboxConversations = inboxConversations;
      //console.log(inboxConversations)
    });
  }


  getMessagesByConversation(inboxConversation: IInboxConversation): void {
    if (this.selectConversationId !== inboxConversation.id) {
      this.isFirstSended = false;
    }
    this.currentConversation = inboxConversation;
    this.inboxConversation = inboxConversation;
    this.inboxConversation.seen = true;
    this.inboxMessages = [];
    this.inboxService.getMessages(inboxConversation.id).subscribe(messages => {
      this.inboxMessages = messages;
      this.inboxService.interceptCount();
    });
    this.selectConversation = true;
  }

  searchInboxConversation() {
    if (this.searchFormControl.value) {
      this.loading = true;
      this.inboxService.searchInboxConversation(this.searchFormControl.value).subscribe(inboxConversations => {
        this.loading = false;
        this.inboxConversations = inboxConversations;
      });
    } else {
      this.loadAll();
    }
  }

  getParticipantsForMatSelectSearch() {
    this.inboxConversationModal.participants = [];
    this.userImplService.listCustomers().subscribe(participants => {
      for (const participant of participants) {
        if (participant.email !== this.currentUser.email) {
          this.participants.push(participant);
        }
      }
      this.filteredParticipants.next(this.participants.slice());
    });
    this.participantFilteringCtrl.valueChanges
      .subscribe(() => {
        this.filterParticipants();
      });
  }

  filterParticipants(): void {
    if (!this.participants) {
      return;
    }
    // get the search keyword
    let search = this.participantFilteringCtrl.value;
    if (!search) {
      this.filteredParticipants.next(this.participants.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter participants
    this.filteredParticipants.next(
      this.participants.filter(participant => (participant.name).toLowerCase().indexOf(search) > -1)
    );
  }

  setParticipants(): void {
    this.selectedParticipantsIds = this.participantCtrl.value
  }

  save(): void {
    if (
      !this.inboxConversationModal.subject ||
      !/\S/.test(this.inboxConversationModal.subject) ||
      !this.selectedParticipantsIds.length
    ) {
      this.isValid = false;
      return;
    }
    this.selectedParticipantsIds.forEach(participantId => {
      const participant = new InboxParticipantModel();
      participant.id = participantId;
      this.inboxConversationModal.participants.push(participant);
    });
    this.inboxService.add(this.inboxConversationModal).subscribe(inboxConversation => {
      this.getMessagesByConversation(inboxConversation);
      if (!inboxConversation.lastInBoxMessage) {
        alert(
          "test"
        );
      }
      this.activeModal.close();
      this.loadAll()
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(value => value.unsubscribe());
  }



  getOtherParticipants(inboxParticipants: IInboxParticipant[]): string[] {
    const result: string[] = [];
    inboxParticipants.forEach((participant, index) => {
      if (index !== 0) {
        result.push(participant.name);
      }
    });
    return result;
  }

  uploadFile(event) {
    console.log(event)
    this.selectedFiles = event.target.files;
    this.currentFileUpload = this.selectedFiles.item(0);
  }

  deleteFile() {
    this.selectedFiles = null;
    this.currentFileUpload = null;
    this.reader = new FileReader();
  }


  downloadDocx(message) {
    this.inboxService.downLoadFile(message).subscribe(response => {
      console.log(response)
      const blob: any = new Blob([response]);
      const splitted = message.fileUrl.split('/');
      fileSaver.saveAs(blob, splitted[splitted.length - 1]);
    }, error => {
      console.log('Error downloading the file')
    });

  }

  setRoleMap() {
    this.roleMap.set("ROLE_WEBMASTER", "Webmaster")
    this.roleMap.set("ROLE_ADMIN", "Admin principal")
    this.roleMap.set("ROLE_SECONDARY_ADMIN", "Admin secondaire")
    this.roleMap.set("ROLE_ADVISOR", "Conseiller")
    this.roleMap.set("ROLE_BENEFICIARY", "Bénéficiaire")
    this.roleMap.set("ROLE_ANONYMOUS", "Bénéficiaire")
  }

  goToProfile(id: string, role: string){
    if (role === "ROLE_WEBMASTER" || role === "ROLE_ADMIN" || role === "ROLE_SECONDARY_ADMIN" )
    this.router.navigate(['manageUsers/admins/edit',id,'true'])
    if (role === "ROLE_ADVISOR") {
      this.router.navigate(["manageUsers/advisors/edit",id,'true'])
    }
    if (role === "ROLE_BENEFICIARY" || role === "ROLE_ANONYMOUS") {
      this.router.navigate(["manageUsers/beneficiaries/edit",id,'true'])
    }
  }

  getCurrentUser():User{
    this.userImplService.getUserByUsername(this.authService.loggedUser).subscribe((res:any)=>{
      if (res){
        let user = new User();
        user.id  = res.user_id;
        user.email = res.email;
        user.username = res.username;
        console.log(user);
        return user;
      }
    })
    return ;
  }

  add(){
    const dialogRef = this.dialog.open(AddroomComponent,{
      width : "40%",
      height: "40%",
      data: {conversations : this.inboxConversations}
    });
    dialogRef.afterClosed().subscribe(res =>{
      this.ngOnInit();
    })  
  }
}
