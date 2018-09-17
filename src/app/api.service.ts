import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transaction } from './transaction';

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

  getTransactions(): Observable<any> {
    return this.http.get(
      host + '/transactions',
      httpOptions
    );
  }

  saveTransaction(transaction: Transaction): Observable<Transaction> {
    return Observable.create(subscriber => {
      const params = {
        name: transaction.title,
        amount: transaction.amount,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
      };

      if (transaction.remoteId > 0) {
        params['id'] = transaction.remoteId;
      }

      this.http.post(
        host + '/transactions',
        params,
        httpOptions,
      ).subscribe(
        value => {
          console.log(value);
        },
        error => {
          console.error(error);
        }
      );
    });
  }
}
