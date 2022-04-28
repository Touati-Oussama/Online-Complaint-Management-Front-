import { Complaint } from 'src/app/model/Complaint';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
  };

@Injectable({
  providedIn: 'root'
})
export class CompalintService {

  apiURL: string = 'http://localhost:8080/reclamations';
 
  private _refrshrequired = new Subject<void>();

  get Refreshrequired(){
    return this._refrshrequired;
  }
  constructor(private http: HttpClient,private authService:AuthService) { }

  add(data):Observable<HttpEvent<any>>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    /*return this.http.post(`${this.apiURL}/add`,data,{headers:httpHeaders}).pipe(
      tap(()=>{
        this.Refreshrequired.next();
      })
    );*/
      const req = new HttpRequest('POST', `${this.apiURL}/add`, data, {
        headers:httpHeaders,
        reportProgress: true,
        responseType: 'json'
      });
      return this.http.request(req).pipe(
        tap(()=>{
          this.Refreshrequired.next();
        })
      );
    } 

   getByClientUsername(username):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/client/username/${username}`,{headers:httpHeaders});
   }
   
   getByEmployeeUsername(username):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/employee/${username}`,{headers:httpHeaders});
   }

   getAll():Observable<Complaint[]>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get<Complaint[]>(`${this.apiURL}/all`,{headers:httpHeaders});
   } 

   getClientByRecid(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/client/${id}`,{headers:httpHeaders});
   }


   getClientBySociete(name):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/societe/${name}`,{headers:httpHeaders});
   }

   findByProjet(id):Observable<any[]>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get<any[]>(`${this.apiURL}/projet`,{headers:httpHeaders, params:{id}});

   }

   
   findByType(id):Observable<any[]>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get<any[]>(`${this.apiURL}/type`,{headers:httpHeaders, params:{id}});

   }


   findByFilter(keyword):Observable<any[]>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get<any[]>(`${this.apiURL}/filter/`,{headers:httpHeaders, params:{keyword}});

   }

   findByFilterAndStatus(keyword,status):Observable<any[]>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get<any[]>(`${this.apiURL}/filter/status`,{headers:httpHeaders, params:{keyword,status}});

   }

   getBySocieteAndStatus(societe,name):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/societe/${societe}/status/${name}`,{headers:httpHeaders});
   }


   getReclamation(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/${id}`,{headers:httpHeaders});
   }
   getByStatusName(statusname){
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/status/${statusname}`,{headers:httpHeaders});
   }

   getByStatusClosedOrPending(){
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/status`,{headers:httpHeaders});
   }

   getByEmployeAndStaus(username,statusname){
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/employee/${username}/${statusname}`,{headers:httpHeaders});
   }

   updateStatus(id,statusId): any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(`${this.apiURL}/update/status/${id}/${statusId}`,{headers:httpHeaders});
   }

   forwardToEmployee(id,idEmployee): any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.post(`${this.apiURL}/update/employee/${id}/${idEmployee}`,{headers:httpHeaders});
   }

   delete(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}/delete/${id}`,{headers:httpHeaders});
  }
}
