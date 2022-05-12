import { MessageService } from 'src/app/services/message.service';
import { Etat } from './../../model/Etat';
import { TrelloService } from './../../services/trello.service';
import { UserService } from 'src/app/services/users.service';
import { CompalintService } from './../../services/compalint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css']
})
export class ForwardComponent implements OnInit {

  employees = [];
  data = new FormGroup({
    developper: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    activity: new FormControl('', Validators.required),
    /*projet: new FormControl(''),
    client: new FormControl('')*/
  })
  status = 'EN_ATTENTE';
  complain: any;
  constructor(private route: ActivatedRoute, private complaintService: CompalintService,
    @Optional() public dialogRef: MatDialogRef<ForwardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public complaint: any,
    private router: Router, private messageService: MessageService,
    private trelloService: TrelloService, private userService: UserService) {
    this.complain = complaint;
  }

  ngOnInit(): void {
    console.log(this.complain.complaint.projet);
    const id = this.route.snapshot.params.id;
    this.complaintService.getReclamation(this.complain.complaint.id).subscribe(res => {
      this.userService.getEmployesBySpeciality(res.speciality).subscribe(res => {
        this.employees = res;
      })
    });
    console.log(this.complain.complaint);
  }

  forward() {

    const id = this.data.value['developper'];
    const complaintId = this.complain.complaint.id;
    const projetName = this.complain.complaint.projet;
    const complaintName = this.route.snapshot.params.complaintName;
    const activity = String(this.data.value['activity']);
    const dueDate = this.data.value['date'];
    const description = this.complain.complaint.details;
    let date1 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    if (dueDate <= date1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Date!',
      })
      return;
    }
    var splitted = activity.split(".", activity.length);
    //splitted.forEach(s =>{console.log(s)});


    this.trelloService.getBoardByProjet(projetName).subscribe((res: any) => {
      //create a card in trello
      this.trelloService.addCard(res.idListToDo, this.complain.complaint.sujet, description, dueDate).subscribe((card: any) => {
        console.log(card.id);
        //create a checkList in this card
        this.trelloService.addCheckList(card.id).subscribe((checkList: any) => {
          console.log(checkList.id)
          splitted.forEach(t => {
            //add item to the checkList
            this.trelloService.addItemToCheckList(checkList.id, t).subscribe((res: any) => {
              // get developper username
              this.userService.getStaff(id).subscribe(res => {
                console.log(res.username);
                // get id of developper in the trello
                this.trelloService.getTrelloUserId(res.username).subscribe((member: any) => {
                  console.log(member.id);
                  // assign the developper to the card in trello
                  this.trelloService.addEmployeToCard(card.id, member.id).subscribe((res: any) => {
                    //assign the developper to complaint
                    this.complaintService.forwardToEmployee(complaintId, id).subscribe(res => {
                      //update status of complaint
                      this.complaintService.updateStatus(complaintId, Etat.EN_COURS).subscribe((res) => {
                        if (res) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Success...',
                            text: 'Forward Successfully !',
                          })
                          this.messageService.send('isAddedComplaint');
                          this.data.reset();
                          try {
                            this.dialogRef.close();
                          } catch (error) { }

                        }
                        else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                          })
                        }
                      })
                    })

                  })
                }, err => {
                  console.log('Trello username developper not found');
                  //assign the developper to complaint
                  this.complaintService.forwardToEmployee(complaintId, id).subscribe(res => {
                    //update status of complaint
                    this.complaintService.updateStatus(complaintId, Etat.EN_COURS).subscribe((res) => {
                      if (res) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Success...',
                          text: 'Forward Successfully !',
                        })
                        this.messageService.send('isAddedComplaint');
                        this.data.reset();
                        try {
                          this.dialogRef.close();
                        } catch (error) { }

                      }
                      else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        })
                      }
                    })
                  })
                })
              })
            })
          })
        })
      })
    })


  }



}
