import { UserService } from './../services/users.service';
import { InboxParticipantModel } from './../model/InboxParticipantModel';
import { InboxService } from './../services/inbox.service';
import { IInboxConversation, InboxConversationModel } from './../model/InboxConversationModel';
import { Component, OnInit, ElementRef, ViewChild, Optional, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../services/auth.service';
import { IInboxParticipant } from '../model/InboxParticipantModel';
import { IInboxMessage, InboxMessageModel } from '../model/IInboxMessage';
import { ReplaySubject, Subscription } from 'rxjs';
import { User } from '../model/User';
import { StompService } from '../services/stomp-service.service';
import { ImageService } from '../services/image.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

export const snapshotToArrayByRoom = (snapshot: any,roomname:any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
      if(childSnapshot.val().roomname === roomname){
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
      }

  });
  return returnArr;
};

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatContent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users = [];
  chats = [];
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
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;


  photoSrc =  'api/documents-download/';
  errorFileTooLarge: boolean;
  selectedFiles: FileList;
  currentFileUpload: File;
  reader = new FileReader();
  matcher = new MyErrorStateMatcher();
  ref;
  public conversation : IInboxConversation;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private imageService:ImageService,
              private authService:AuthService,
              private inboxService:InboxService,
              private userService:UserService,
              private stompService:StompService,
              private db: AngularFireDatabase,
              public datepipe: DatePipe) {
              }
  
  /*ngAfterViewInit(): void {
    this.nickname = localStorage.getItem('nickname');
    this.roomname = this.route.snapshot.params.roomname;
    this.db.database.ref('chats/').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArrayByRoom(resp,this.roomname);
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    });
    this.db.database.ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      //console.log(roomusers);
      this.users = roomusers.filter(x => x.status === 'online' );
      this.users = roomusers;
      console.log(this.users);
    });
  }
   
  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = this.db.database.ref('chats/').push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm:ss');
    chat.message = `${this.nickname}  leave the room`;
    chat.type = 'exit';
    const newMessage = this.db.database.ref('chats/').push();
    newMessage.set(chat);

    this.db.database.ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = this.db.database.ref('roomusers/' + user.key);
        userRef.update({status: 'offline'});
      }
    });

    this.router.navigate(['/roomlist']);
  }*/

  ngOnInit(){
    this.roomname = this.route.snapshot.params.roomname;
    this.stompService.subscribe('/topic/new Message',() : void =>{
      this.loadAll(this.roomname);
        this.getMessagesByConversation(this.inboxConversation);
    })
    this.userService.getUserByUsername(this.authService.loggedUser).subscribe((res:any)=>{
      let user = new User();
      user.id  = res.user_id;
      user.email = res.email;
      this.currentUser = user;
    })

    this.loadAll(this.roomname);
   
    
  }

  loadAll(roomname){
    this.inboxService.findAll().subscribe((res:IInboxConversation[])=>{
      res.forEach(r=>{
        if (r.subject === roomname){
            this.conversation = r;
            this.getMessagesByConversation(this.conversation);
            this.participants = r.participants;
        }
        return;
      })

      this.participants.forEach(p=>{
        this.imageService.getImage(p.username).subscribe((res)=>{
          if (res != null){
            let retrieveResonse = res;
            let base64Data = retrieveResonse.data;
            let retrievedImage = 'data:image/jpeg;base64,' + base64Data;
            p.photo = retrievedImage;
          }
        })
      })
      console.log(this.participants);
    })
  }

  sendMessage(): void {
    this.roomname = this.route.snapshot.params.roomname;
    this.inboxService.findAll().subscribe((res:IInboxConversation[])=>{
      res.forEach(r=>{
        if (r.subject === this.roomname){
            this.conversation = r;
            this.userService.getUserByUsername(this.authService.loggedUser).subscribe((user:any)=>{
              if (user){
                this.imageService.getImage(this.authService.loggedUser).subscribe((res)=>{
                  if (res != null)
                  {
                    this.retrieveResonse = res;
                    this.base64Data = this.retrieveResonse.data;
                    this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;

                    let message = new InboxMessageModel();
                    message.message = this.messageFormControl.value;
                    message.inboxConversationId = r.id;
                    message.fromId = user.user_id;
                    message.userPhoto = this.retrievedImage;
                    this.inboxService.sendMessage(message).subscribe(msg => {
             
                    });
                  }

                })
        

              }
            })
        }
        return;
      })
    })


  }

  getMessagesByConversation(inboxConversation: IInboxConversation): void {

    this.currentConversation = inboxConversation;
    this.inboxConversation = inboxConversation;
    this.inboxMessages = [];
    this.inboxService.getMessages(inboxConversation.id).subscribe(messages => {
      this.inboxMessages = messages;
      console.log(this.inboxMessages)
      this.inboxService.interceptCount();
    });
    this.selectConversation = true;
  }

  exitChat() {
    this.router.navigate(['/roomlist']);
  }

}