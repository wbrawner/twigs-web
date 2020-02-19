import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { User } from '../users/user';
import { TwigsService } from './twigs.service';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';

@Injectable({
  providedIn: 'root'
})
export class TwigsHttpService implements TwigsService {

  constructor(
    private http: HttpClient
  ) { }

  private options = {
    withCredentials: true
  };

  // TODO: Set this up in environment variables
  private apiUrl = 'https://budget-api.intra.wbrawner.com';
  // private apiUrl = 'https://code.brawner.home/spring';
  // private apiUrl = 'http://localhost:8080';

  // Auth
  login(email: string, password: string): Observable<User> {
    const params = {
      'username': email,
      'password': password
    };
    return this.http.post<User>(this.apiUrl + '/users/login', params, this.options);
  }

  register(username: string, email: string, password: string): Observable<User> {
    const params = {
      'username': username,
      'email': email,
      'password': password
    };
    return this.http.post<User>(this.apiUrl + '/users/new', params, this.options);
  }

  logout(): Observable<void> {
    return Observable.throw('Not Implemented');
  }

  // Budgets
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl + '/budgets', this.options);
  }

  getBudget(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/budgets/${id}`, this.options);
  }

  createBudget(
    name: string,
    description: string,
    userIds: number[],
  ): Observable<Budget> {
    const params = {
      'name': name,
      'description': description,
      'userIds': userIds
    };
    return this.http.post<Budget>(this.apiUrl + '/budgets/new', params, this.options);
  }

  updateBudget(id: number, changes: object): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/budgets/${id}`, changes, this.options);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/budgets/${id}`, this.options);
  }

  // Categories
  getCategories(budgetId: number, count?: number): Observable<Category[]> {
    const params = {
      params: new HttpParams()
        .set('budgetIds', `${budgetId}`)
    };
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, Object.assign(params, this.options));
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`, this.options);
  }

  createCategory(budgetId: number, name: string, amount: number, isExpense: boolean): Observable<Category> {
    const params = {
      'title': name,
      'amount': amount,
      'expense': isExpense,
      'budgetId': budgetId
      };
    return this.http.post<Category>(this.apiUrl + '/categories/new', params, this.options);
  }

  updateCategory(budgetId: number, id: number, changes: object): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, changes, this.options);
  }

  deleteCategory(budgetId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`, this.options);
  }

  // Transactions
  getTransactions(budgetId?: number, categoryId?: number, count?: number): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    if (budgetId) {
      httpParams = httpParams.set('budgetId', `${budgetId}`);
    }
    if (categoryId) {
      httpParams = httpParams.set('categoryId', `${categoryId}`);
    }
    const params = { params: httpParams };
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, Object.assign(params, this.options));
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`, this.options);
  }

  createTransaction(
    budgetId: number,
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: number
  ): Observable<Transaction> {
    const params = {
      'title': name,
      'description': description,
      'date': date,
      'amount': amount,
      'expense': isExpense,
      'categoryId': category,
      'budgetId': budgetId
    };
    return this.http.post<Transaction>(this.apiUrl + '/transactions/new', params, this.options);
  }

  updateTransaction(budgetId: number, id: number, changes: object): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, changes, this.options);
  }

  deleteTransaction(budgetId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`, this.options);
  }

  // Users
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, this.options);
  }

  getUsersByUsername(username: string): Observable<User[]> {
    return Observable.create(subscriber => {
      subscriber.error("Not yet implemented")
    });
  }
}
