import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  apiURL: string = 'http://localhost:8080/files';
  
  constructor(private http: HttpClient,private authService:AuthService)  { }

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

  getBySfe(id:number):Observable<any>{
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    return this.http.get(`${this.apiURL}/complaint/${id}`,{headers:httpHeaders});
  }

  downloadFile(id) {
    // we would call the spring-boot service
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({"Authorization": jwt})
    const REQUEST_URI = this.apiURL + "/download/"+id;
    return this.http.get(REQUEST_URI, {
      headers: httpHeaders,
      params: null,
      responseType: 'arraybuffer'
    })
  }


  /*test(id): any{		
      const REQUEST_URI = this.apiURL + "/download/"+id;
      return this.http.get(REQUEST_URI, { responseType : 'Blob' });
  }*/
  
}
