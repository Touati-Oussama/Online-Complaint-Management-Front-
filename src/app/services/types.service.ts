import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
  };
  
@Injectable({
  providedIn: 'root'
})
export class TypeService {

  apiURL: string = 'http://localhost:8080/types';

  private refreshrequired = new Subject<void>();
 
  get Refreshrequired(){
    return this.refreshrequired;
  }

  constructor(private http: HttpClient,private authService:AuthService) { }

  public listeType(): Observable<Object>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/all`,{headers:httpHeaders});
  }

  add(data):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(`${this.apiURL}/add`,data,{headers:httpHeaders}).pipe(
      tap(() =>{
        this.refreshrequired.next();
      })
    );
  }

  delete(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}/delete/${id}`,{headers:httpHeaders});
  }

  update(data,id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(`${this.apiURL}/update/${id}`,data,{headers:httpHeaders})
  }

  getType(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/${id}`,{headers:httpHeaders});
  }




}
