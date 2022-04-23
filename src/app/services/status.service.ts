import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
  };
  
@Injectable({
  providedIn: 'root'
})
export class StatusService {

  apiURL: string = 'http://localhost:8080/status/';

  data = new FormGroup(
    {
      id: new FormControl('',[Validators.required]),
      status: new FormControl('',[Validators.required]),
      dateCreation : new FormControl('',[Validators.required]),
    }
  )
  constructor(private http: HttpClient,private authService:AuthService) { }

  listeStatus():any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(this.apiURL+'all',{headers:httpHeaders});
  }

  add(data):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(this.apiURL+'add',data,{headers:httpHeaders});
  }

  delete(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}delete/${id}`,{headers:httpHeaders});
  }

  update(data,id): any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(`${this.apiURL}update/${id}`,data,{headers:httpHeaders});
  }

  getStatus(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}${id}`,{headers:httpHeaders});
  }

  populateForm(d){
    this.data.setValue(d);
  }
}
