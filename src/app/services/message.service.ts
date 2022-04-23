import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private subject = new Subject();

  send(message: string) {
    this.subject.next({message: message});
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
