import { IInboxConversation } from './../model/InboxConversationModel';
import { InboxService } from './../services/inbox.service';
import { SocieteService } from 'src/app/services/societe.service';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css']
})
export class AddroomComponent implements OnInit {

  roomForm: FormGroup;
  nickname = '';
  roomname = '';
  ref ;
  matcher = new MyErrorStateMatcher();
  societies = [];
  chats = [];
  data = new FormGroup(
    {
      societe: new FormControl('',[Validators.required]),
    }
  )


  constructor(private router: Router,
              private route: ActivatedRoute,
              private db: AngularFireDatabase,
              private societeService:SocieteService,
              private formBuilder: FormBuilder,
              private inboxService:InboxService,
              public dialogRef: MatDialogRef<AddroomComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public conversations: any,
              private  snackBar: MatSnackBar) {
                this.ref = db.database.ref('rooms/');
                this.chats = conversations.conversations;
                console.log(this.chats);
              }

  /*ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      'roomname' : [null, Validators.required]
    });

  }

  onFormSubmit(form: any) {
    const room = form;
    this.ref.orderByChild('roomname').equalTo(room.roomname).once('value', (snapshot: any) => {
      if (snapshot.exists()) {
        this.snackBar.open('Room name already exist!');
      } else {
        //const newRoom = firebase.database().ref('rooms/').push();
        const newRoom = this.db.database.ref('rooms/').push();
        newRoom.set(room);
        this.router.navigate(['/roomlist']);
      }
    });
  }*/

  ngOnInit(): void {
    this.loadSocieteies();
  }

  add(){
    this.inboxService.add(this.data.value['societe']).subscribe((res:IInboxConversation)=>{
      if(res){
        Swal.fire({
          icon: 'success',
          title: 'Succès...',
          text: "Conversation ajoutée avec succès",
        })
        this.OnClose();
      }
    })
  }

  OnClose(){
    this.dialogRef.close();      
  }

  loadSocieteies(){
    this.societeService.listeSocieties().toPromise().then((res:any[])=>{
      res.forEach(re=>{
        let ok = false;
        this.chats.forEach(chat=>{
          if (chat.subject === re.name)
            ok = true;
            return;
        })
        if (!ok)
          this.societies.push(re);
      })
    })
  }
}