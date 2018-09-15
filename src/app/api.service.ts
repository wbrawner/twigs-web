import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true,
};

const host = 'http://localhost:9090';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      host + '/login',
      {
        'username': username,
        'password': password
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      host + '/register',
      {
        'username': username,
        'email': email,
        'password': password
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.get(
      host + '/logout',
      httpOptions
    );
  }
}
