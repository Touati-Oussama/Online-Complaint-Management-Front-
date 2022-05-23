import { AuthService } from './auth.service';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';


const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
  };

  
@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL: string = 'http://localhost:8080/users';
  constructor(private http: HttpClient,private authService:AuthService) { }

  public listCustomers():any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers/all`,{headers:httpHeaders});
  }

  /*public listCustomersBySociete(societe,role):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers/all/${societe}/${role}`,{headers:httpHeaders});
  }*/

  public listCustomersBySociete(societe):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers`,
    {headers:httpHeaders,
    params: {societe: societe}}
    );
  }

  public listCustomersBySocieteAndFilter(societe,keyword):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers/filter`,
    {headers:httpHeaders,
    params: {societe: societe, keyword:keyword}
    }
    );
  }
  public listCustomersAndFilter(keyword):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers/all/filter/`,
    {headers:httpHeaders,
    params: {keyword:keyword}
    }
    );
  }




  public listStaffs():any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/all/teams`,{headers:httpHeaders});
  }
  add(data):Observable<HttpEvent<any>>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    const req = new HttpRequest('POST', `${this.apiURL}/add/customers`, data, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
    //return this.http.post(`${this.apiURL}/add/customers`,data,{headers:httpHeaders});
  }

  addStaff(data):Observable<HttpEvent<any>>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt});

    const req = new HttpRequest('POST', `${this.apiURL}/add/staff`, data, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
    //return this.http.post(`${this.apiURL}/add/staff`,data,{headers:httpHeaders});
  }

  deleteCustomers(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}/customers/delete/${id}`,{headers:httpHeaders});
  }

  deleteStaff(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.delete(`${this.apiURL}/teams/delete/${id}`,{headers:httpHeaders});
  }

  getCustomer(id):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers/get/${id}`,{headers:httpHeaders});
  }

  getCustomerByUsername(usernmae):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/customers/${usernmae}`,{headers:httpHeaders});
  }

  getUserByUsername(username):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}`,
    {
      headers:httpHeaders,
      params: {username:username}
    }
    );
  }
  
  getStaff(id):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/teams/get/${id}`,{headers:httpHeaders});
  }

  getUser(id):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/${id}`,{headers:httpHeaders});
  }

  updateCustomers(data,id):Observable<HttpEvent<any>>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt});
    const req = new HttpRequest('PUT', `${this.apiURL}/customers/update/${id}`, data, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);

    //return this.http.put(`${this.apiURL}/customers/update/${id}`,data,{headers:httpHeaders});
  }
  updateTeams(data,id):Observable<HttpEvent<any>>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
   // return this.http.put(`${this.apiURL}/teams/update/${id}`,data,{headers:httpHeaders});
    const req = new HttpRequest('PUT', `${this.apiURL}/teams/update/${id}`, data, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getEmployesBySpeciality(speciality):any{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/all/teams/${speciality}`,{headers:httpHeaders});
  }

  updateCompteStatus(id,enabled):any{
    console.log(typeof(enabled));
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    let httparams = new HttpParams()
    .set('id',id)
    .set('enabled',enabled);
    return this.http.post(`${this.apiURL}`,null,{
      headers:httpHeaders,
      params:httparams
    });
  }


}
