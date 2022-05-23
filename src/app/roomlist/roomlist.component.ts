import { InboxService } from './../services/inbox.service';
import { UserService } from './../services/users.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { IInboxConversation } from '../model/InboxConversationModel';
import { AddroomComponent } from '../addroom/addroom.component';
import { MatDialog } from '@angular/material/dialog';


export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];
  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

export const snapshotToArrayTest = (snapshot: any,societe:any) => {
  const returnArr = [];
  snapshot.forEach((childSnapshot: any) => {
      if (childSnapshot.val().roomname === societe){
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
      }

  });
  return returnArr;
};

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  inboxConversations: IInboxConversation[] = [];
  nickname = '';
  //displayedColumns: string[] = ['roomname'];
  rooms = [];
  test = [];
  isLoadingResults = true;
  societe

  constructor(private inboxService:InboxService,private router:Router,public authService:AuthService,
        private dialog:MatDialog,){

  }
  /*nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  test = [];
  isLoadingResults = true;
  societe
  constructor(private route: ActivatedRoute,private userService:UserService, private router: Router,public authService:AuthService, public datepipe: DatePipe,private db: AngularFireDatabase,) {
    this.nickname = localStorage.getItem('nickname');
    db.database.ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      if (authService.isPersonnel_Societe())
      {
        this.userService.getCustomerByUsername(this.authService.loggedUser).subscribe(res =>{
          this.societe = res.societe;
          this.test = snapshotToArrayTest(resp,res.societe)
          console.log(this.test);
        })
      }
      
      this.isLoadingResults = false;
    });
  }

  ngOnInit(): void {
  }

  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = this.db.database.ref('chats/').push();
    newMessage.set(chat);

    this.db.database.ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = this.db.database.ref('roomusers/' + user.key);
        userRef.update({status: 'online'});
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '',title:'' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        if (this.authService.isAdmin())
          newroomuser.title = 'Responsable GPRO';
        if (this.authService.isEmployee())
          newroomuser.title = 'Personnel GPRO';
        if (this.authService.isPersonnel_Societe())
          newroomuser.title = 'Personnel Societe';
        const newRoomUser = this.db.database.ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });

    this.router.navigate(['/chatroom', roomname]);
  }

  logout(): void {
    if (this.authService.isEmployee)
      this.router.navigate(['/dashboard-employee']);
    if (this.authService.isPersonnel_Societe)
      this.router.navigate(['/dashboard-customer']);
    if (this.authService.isAdmin)
      this.router.navigate(['/dashboard-admin']);
  }*/

 ngOnInit(): void {
   this.loadAll();
 }


 loadAll(): void {
  this.inboxService.findAll().subscribe(inboxConversations => {
    this.inboxConversations = inboxConversations;
    //console.log(inboxConversations)
  });
  }



  enterChatRoom(room:IInboxConversation) {
    this.router.navigate(['chatroom/'+room.subject])
  }

  logout(): void {
    if (this.authService.isEmployee)
      this.router.navigate(['/dashboard-employee']);
    if (this.authService.isPersonnel_Societe)
      this.router.navigate(['/dashboard-customer']);
    if (this.authService.isAdmin)
      this.router.navigate(['/dashboard-admin']);
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