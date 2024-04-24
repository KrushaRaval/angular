import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api/Auth/Signup';
  private api = 'api/Auth/Login'; 
  private apilogout = 'api/Auth/Logout';
  
  constructor(private http: HttpClient) { }
  signup(data:signUp) :  Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    return this.http.post(environment.URL + 'api/Auth/Signup', data,{'headers':headers})
  }

  Login(data:Login) :  Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    return this.http.post(environment.URL + 'api/Auth/Login', data,{'headers':headers})
  }
  
  logout(): Observable<any> {
    const header = new HttpHeaders().set("Authorization",'Bearer ' + localStorage.getItem("token") || ""
    );
    return this.http.get(environment.URL + 'api/Auth/Logout',{ headers: header });
  }

}
export class signUp {
  userName!: string;
  email!: string;  
  password!: string;
  confirmPassword!: string;
  userRole!: string;
}

export class Login {
  email!: string;  
  password!: string;
}