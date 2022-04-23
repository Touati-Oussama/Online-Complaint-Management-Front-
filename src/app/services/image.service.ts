import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
  };

  
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  apiURL: string = 'http://localhost:8080/images';
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  constructor(private http: HttpClient,private authService:AuthService) { }
  upload(id:number,file: File): Observable<HttpEvent<any>> {
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    const formData: FormData = new FormData();
    formData.append('file', file);
    
    const req = new HttpRequest('POST', `${this.apiURL}/upload/${id}`, formData, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  update(id:number,file: File): any {
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    const formData: FormData = new FormData();
    formData.append('file', file);
    
    /*const req = new HttpRequest('POST', `${this.apiURL}/update/${id}`, formData, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);*/

    return this.http.post(this.apiURL +'/update/'+id, formData, {headers: httpHeaders ,observe: 'response' })

  }


  uploadd(file: File): any {
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    const formData: FormData = new FormData();
    formData.append('file', file);

    /*const req = new HttpRequest('POST', `${this.apiURL}/upload`, file, {
      headers:httpHeaders,
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);*/
    return this.http.post(this.apiURL +'/upload', formData, {headers: httpHeaders ,observe: 'response' })
  }

  getFile(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/user/${id}`);
  }

  get(imageName: String): any {
    return this.http.get('http://localhost:8080/image/get/' + imageName);
  }

  getImage(username: String): any {
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/user/${username}`,{headers: httpHeaders});
  }
}
