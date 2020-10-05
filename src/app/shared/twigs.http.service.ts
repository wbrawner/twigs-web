import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { User, UserPermission, Permission } from '../users/user';
import { TwigsService } from './twigs.service';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TwigsHttpService implements TwigsService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private options = {
    withCredentials: true
  };

  private apiUrl = environment.apiUrl;

  // Auth
  login(email: string, password: string): Observable<User> {
    // const params = {
    //   'username': email,
    //   'password': password
    // };
    // return this.http.post<User>(this.apiUrl + '/users/login', params, this.options);
    const credentials = btoa(`${email}:${password}`)
    this.cookieService.set('Authorization', credentials, 14, null, null, true);
    return this.getProfile();
  }

  register(username: string, email: string, password: string): Observable<User> {
    const params = {
      'username': username,
      'email': email,
      'password': password
    };
    return this.http.post<User>(this.apiUrl + '/users', params, this.options);
  }

  logout(): Observable<void> {
    return Observable.create(emitter => {
      this.cookieService.delete('Authorization');
      emitter.next();
      emitter.complete();
    })
    // TODO: Implement this when JWT auth is implemented
    // return this.http.post<void>(this.apiUrl + '/login?logout', this.options);
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
    users: UserPermission[],
  ): Observable<Budget> {
    const params = {
      'name': name,
      'description': description,
      'users': users.map(userPermission => {
        return {
          user: userPermission.user.id,
          permission: Permission[userPermission.permission]
        };
      })
    };
    return this.http.post<Budget>(this.apiUrl + '/budgets', params, this.options);
  }

  updateBudget(id: number, changes: object): Observable<Budget> {
    let budget = changes as Budget;
    const params = {
      'name': budget.name,
      'description': budget.description,
      'users': budget.users.map(userPermission => {
        return {
          user: userPermission.user.id,
          permission: Permission[userPermission.permission]
        };
      })
    };
    return this.http.put<Budget>(`${this.apiUrl}/budgets/${id}`, params, this.options);
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
    return this.http.post<Category>(this.apiUrl + '/categories', params, this.options);
  }

  updateCategory(budgetId: number, id: number, changes: object): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, changes, this.options);
  }

  deleteCategory(budgetId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`, this.options);
  }

  // Transactions
  getTransactions(
    budgetId?: number,
    categoryId?: number,
    count?: number,
    from?: Date
  ): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    if (budgetId) {
      httpParams = httpParams.set('budgetIds', `${budgetId}`);
    }
    if (categoryId) {
      httpParams = httpParams.set('categoryIds', `${categoryId}`);
    }
    if (from) {
      httpParams = httpParams.set('from', from.toISOString());
    }
    const params = { params: httpParams };
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, Object.assign(params, this.options))
      .pipe(map(transactions => {
        transactions.forEach(transaction => {
          transaction.date = new Date(transaction.date);
        });
        return transactions;
      }));
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`, this.options)
      .pipe(map(transaction => {
        transaction.date = new Date(transaction.date);
        return transaction;
      }));
  }

  createTransaction(
    budgetId: number,
    name: string,
    description: string,
    amount: number,
    date: Date,
    expense: boolean,
    category: number
  ): Observable<Transaction> {
    const params = {
      'title': name,
      'description': description,
      'date': date.toISOString(),
      'amount': amount,
      'expense': expense,
      'categoryId': category,
      'budgetId': budgetId
    };
    return this.http.post<Transaction>(this.apiUrl + '/transactions', params, this.options);
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
