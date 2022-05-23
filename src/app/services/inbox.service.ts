import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
//import {IInboxConversation} from '../shared/models/inbox-conversation.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import { IInboxConversation } from '../model/InboxConversationModel';
import { IInboxMessage } from '../model/IInboxMessage';
//import {IInboxMessage} from 'app/shared/models/inbox-message.model';

@Injectable({providedIn: 'root'})
export class InboxService {

  apiUrl: string = 'http://localhost:8080/rooms';
  private newMessageReceived = new BehaviorSubject(false);
  sharedNewMessage = this.newMessageReceived.asObservable();

  private newCount = new BehaviorSubject(false);
  sharedNewCount = this.newCount.asObservable();

  constructor(private http: HttpClient, private toaster: ToastrService) {
  }

  public findAll() {
    return this.http.get<IInboxConversation[]>(this.apiUrl + '/all');
  }

  public add(societe:any) {
    return this.http.post<IInboxConversation>(this.apiUrl+ '/add',null,{
      params:{ societe: societe}
    });
  }

  public getMessages(inboxConversationId: string) {
    return this.http.get<IInboxMessage[]>('http://localhost:8080/messages',{
      params:{conversationId: inboxConversationId}
    });
  }

  public sendMessage(inboxMessage: IInboxMessage) {
    return this.http.post<IInboxMessage>( 'http://localhost:8080/messages/add', inboxMessage);
  }

  public countUnreadMessages() {
    return this.http.get<number>('api/' + 'unread-messages-number');
  }

  public interceptNewMessageReceived() {
    this.newMessageReceived.next(true);
    // this.toaster.success('New message received');
  }

  public interceptCount() {
    this.newCount.next(true);
  }

  public searchInboxConversation(name: String) {
    return this.http.get<any[]>( 'api/' + 'inbox-conversations-by-name/' + name);
  }

  uploadMessageFile(file: File, messageId: string): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post('api/upload-message-file/' + messageId, formdata);
  }

  public downLoadFile(message: any): Observable<any> {
    // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    return this.http.get('api/message-file-download/' + message.id, {responseType: 'blob'});
  }
}
