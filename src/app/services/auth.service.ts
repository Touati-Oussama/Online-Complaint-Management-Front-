import { ImageService } from './image.service';


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  apiURL : string ='http://localhost:8080';
  token: string;
  public loggedUser:string;
  public isloggedIn: Boolean = false;
  public roles:string[];
  private helper = new JwtHelperService();



  constructor(private router: Router,private http: HttpClient) { }

  login(user: User){
    return this.http.post<User>(this.apiURL+'/login',user,{observe:'response'});
  }

  signup(user:User){
    return this.http.post(this.apiURL+'/add',user,{observe:'response'});
  }
  saveToken(jwt:string){
    localStorage.setItem('jwt',jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();

  }
  getToken():string {
    return this.token;
  }

  decodeJWT()
  {
    if (this.token == undefined)
      return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.roles = decodedToken.roles;
    this.loggedUser = decodedToken.sub;
  }

  loadToken() {
    this.token = localStorage.getItem('jwt');
    this.decodeJWT();
    }
  isTokenExpired(): Boolean
    {
    return this.helper.isTokenExpired(this.token); 
    }

    logout() {
      this.loggedUser = undefined;
      this.roles = undefined;
      this.token= undefined;
      this.isloggedIn = false;
      localStorage.removeItem('jwt');
      this.router.navigate(['/login']);
      }
  isAdmin():Boolean{
    if (!this.roles) //this.roles== undefiened
        return false;
    return (this.roles.indexOf('ADMIN') >=0);
  }

  isPersonnel_Societe():Boolean{
    if (!this.roles) //this.roles== undefiened
        return false;
    return (this.roles.indexOf('PERSONNEL_SOCIETE') >=0);
  }

  isEmployee():Boolean{
    if (!this.roles) //this.roles== undefiened
        return false;
    return (this.roles.indexOf('EMPLOYEE') >=0);
  }

  isResponsable_Societe():Boolean{
    if (!this.roles) //this.roles== undefiened
      return false;
    return (this.roles.indexOf('RESPONSABLE_SOCIETE') >=0);
  }

  setLoggedUserFromLocalStorage(login : string) {
    this.loggedUser = login;
    this.isloggedIn = true;
  }

  
}
