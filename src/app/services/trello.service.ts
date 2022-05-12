import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  constructor(private http: HttpClient) { }

  addBoard(name){
    return this.http.post('https://api.trello.com/1/boards/', null,{params:{
      key: environment.KEY,
      token: environment.TOKEN,
      name:name
    }})
  }

  getBoardByProjet(designation){
    return this.http.get('http://localhost:8080/projet/trello/board/',{params:{
      key: environment.KEY,
      token: environment.TOKEN,
      projet: designation
    }})
  }
  getBoardList(id){
    return this.http.get('https://api.trello.com/1/boards/'+ id +'/lists',{params:{
      key: environment.KEY,
      token: environment.TOKEN,
    }})
  }
  getTrelloUserId(username){
    return this.http.get('https://api.trello.com/1/members/'+username);
  }
  addCard(idListToDo,cardName,description,dueDate){
    return this.http.post('https://api.trello.com/1/cards/',null,{params:{
      key: environment.KEY,
      token: environment.TOKEN,
      idList: idListToDo,
      name: cardName,
      due: dueDate,
      dueReminder: '1',
      desc: description
    }})
  }

  addEmployeToCard(cardId,memberId){
    return this.http.post('https://api.trello.com/1/cards/' + cardId+ '/idMembers',null,{params:{
      key: environment.KEY,
      token: environment.TOKEN,
      value: memberId
    }})
  }

  addCheckList(cardId){
    return this.http.post('https://api.trello.com/1/checklists/',null,{params:{
      key: environment.KEY,
      token: environment.TOKEN,
      idCard: cardId,
      name: 'What must to do'

    }})
  }

  addItemToCheckList(idCheckList,name){
    return this.http.post('https://api.trello.com/1/checklists/'+ idCheckList+ '/checkItems',null,{params:{
      key: environment.KEY,
      token: environment.TOKEN,
      name: name

    }})
  }

  getAllCardInListDone(idListDone){
    return this.http.get('https://api.trello.com/1/lists/'+idListDone+'/cards',{params:{
      key: environment.KEY,
      token: environment.TOKEN,

    }})
  }

  getAllcardInListToDo(idListDoing){
    return this.http.get('https://api.trello.com/1/lists/'+ idListDoing+'/cards',{params:{
      key: environment.KEY,
      token: environment.TOKEN,

    }})
  }
  deleteCardInTrello(idCard){
    return this.http.delete('https://api.trello.com/1/cards/'+idCard,{params:{
      key: environment.KEY,
      token: environment.TOKEN,
    }})
  }
}
