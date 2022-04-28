import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SocieteService {

  apiURL: string = 'http://localhost:8080/societe';

  data = new FormGroup(
    {
      id: new FormControl('',[Validators.required]),
      status: new FormControl('',[Validators.required]),
      dateCreation : new FormControl('',[Validators.required]),
    }
  )
  
  constructor(private http: HttpClient,private authService:AuthService) { }

  listeSocieties():any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(this.apiURL+'/all',{headers:httpHeaders});
  }

  add(data):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(this.apiURL+'/add',data,{headers:httpHeaders});
  }

  delete(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}/delete/${id}`,{headers:httpHeaders});
  }

  update(data,id): any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(`${this.apiURL}/update/${id}`,data,{headers:httpHeaders});
  }

  getSociety(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/${id}`,{headers:httpHeaders});
  }
  getSocietyByName(name):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/get/${name}`,{headers:httpHeaders});
  }
  
 
}
