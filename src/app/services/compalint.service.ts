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

    
  addTest(data):any{
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

    forwardToEmployee(id,idEmployee):Observable<HttpEvent<any>>{
      let jwt = this.authService.getToken();
      jwt = "Bearer " + jwt;
      let httpHeaders = new HttpHeaders({"Authorization": jwt})
      return this.http.post<HttpEvent<any>>(`${this.apiURL}/update/employee/${id}/${idEmployee}`,{headers:httpHeaders});
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


   delete(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}/delete/${id}`,{headers:httpHeaders});
  }

  details(username):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/user`,{headers:httpHeaders,params:{username:username}});
  }

  detailsByDates(username,date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/user/dates`,{headers:httpHeaders,
      params:{
        username:username,
        date1:date1,
        date2:date2
      }
      });
  }

  detailsParEtat():Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/status`,{headers:httpHeaders});
  }

  detailsParProjet():Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/projet`,{headers:httpHeaders});
  }

  detailsParProjetEtDate(date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/projet/dates`,{headers:httpHeaders,
      params:{
        date1:date1,
        date2:date2
      }});
  }

  detailsParProjetAndStatus(status):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/projet/status`,{headers:httpHeaders,params:{status:status}});
  }

  detailsParProjetAndStatusAndDate(status,date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/projet/status/dates`,{headers:httpHeaders,
      params:{
        status:status,
        date1:date1,
        date2:date2
      }});
  }

  detailsParType():Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/type`,{headers:httpHeaders});
  }


  detailsParTypeEtDate(date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/type/dates`,{headers:httpHeaders,params:{
      date1:date1,
      date2:date2
    }});
  }

  detailsParTypeAndStatus(status):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/type/status`,{headers:httpHeaders,params:{status:status}});
  }

  detailsParTypeAndStatusAndDate(status,date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/type/status/dates`,{headers:httpHeaders,
      params:{
        status:status,
        date1:date1,
        date2:date2
      }});
  }

  detailsParPersonnel():Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/personnel`,{headers:httpHeaders});
  }
  detailsParPersonnelEtDate(date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/personnel/dates`,{headers:httpHeaders,params:{
      date1:date1,
      date2:date2
    }});
  }

  detailsParPersonnelAndStatus(status):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/personnel/status`,{headers:httpHeaders,params:{status:status}});
  }

  detailsParPersonnelAndStatusAndDate(status,date1,date2):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/details/personnel/status/dates`,{headers:httpHeaders,
      params:{
        status:status,
        date1:date1,
        date2:date2
      }});
  }
}
