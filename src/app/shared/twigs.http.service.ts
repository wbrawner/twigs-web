import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe, Subscriber } from 'rxjs';
import { User, UserPermission, Permission, AuthToken } from '../users/user';
import { TwigsService } from './twigs.service';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TwigsHttpService implements TwigsService {

  private options = {
    withCredentials: true
  };
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async login(email: string, password: string): Promise<User> {
    const url = new URL('/api/users/login', this.apiUrl)
    const auth: AuthToken = await this.request(url, HttpMethod.POST, {
      'username': email,
      'password': password
    });
    this.storage.setItem('Authorization', auth.token);
    this.storage.setItem('userId', auth.userId);
    return await this.getProfile(auth.userId);
  }

  register(username: string, email: string, password: string): Promise<User> {
    const body = {
      'username': username,
      'email': email,
      'password': password
    };
    const url = new URL('/api/users/register', this.apiUrl)
    return this.request<User>(url, HttpMethod.POST, body);
  }

  logout(): Promise<void> {
    this.storage.removeItem('Authorization');
    this.storage.removeItem('userId');
    return Promise.resolve()
    // TODO: Implement this to revoke the token server-side as well
    // return this.http.post<void>(this.apiUrl + '/login?logout', this.options);
  }

  // Budgets
  getBudgets(): Promise<Budget[]> {
    const url = new URL('/api/budgets', this.apiUrl)
    return this.request(url, HttpMethod.GET)
  }

  getBudgetBalance(
    id: string,
    from?: Date,
    to?: Date
  ): Promise<number> {
    const url = new URL('/api/transactions/sum', this.apiUrl)
    url.searchParams.set('budgetId', id)
    if (from) {
      url.searchParams.set('from', from.toISOString());
    }
    if (to) {
      url.searchParams.set('to', to.toISOString());
    }
    return this.request(url, HttpMethod.GET).then((res: any) => res.balance)
  }

  getBudget(id: string): Promise<Budget> {
    const url = new URL(`/api/budgets/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.GET)
  }

  createBudget(
    id: string,
    name: string,
    description: string,
    users: UserPermission[],
  ): Promise<Budget> {
    const url = new URL('/api/budgets', this.apiUrl)
    const body = {
      'id': id,
      'name': name,
      'description': description,
      'users': users.map(userPermission => {
        return {
          user: userPermission.user,
          permission: Permission[userPermission.permission]
        };
      })
    };
    return this.request(url, HttpMethod.POST, body)
  }

  updateBudget(id: string, budget: Budget): Promise<Budget> {
    const url = new URL(`/api/budgets/${id}`, this.apiUrl)
    const body = {
      'name': budget.name,
      'description': budget.description,
      'users': budget.users.map(userPermission => {
        return {
          user: userPermission.user,
          permission: Permission[userPermission.permission]
        };
      })
    };
    return this.request(url, HttpMethod.PUT, body)
  }

  deleteBudget(id: String): Promise<void> {
    const url = new URL(`/api/budgets/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.DELETE)
  }

  // Categories
  getCategories(budgetId: string, count?: number): Promise<Category[]> {
    const url = new URL(`/api/categories`, this.apiUrl)
    url.searchParams.set('budgetIds', budgetId)
    url.searchParams.set('archived', 'false')
    return this.request(url, HttpMethod.GET);
  }

  getCategory(id: string): Promise<Category> {
    const url = new URL(`/api/categories/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.GET);
  }

  async getCategoryBalance(
    id: string,
    from?: Date,
    to?: Date
  ): Promise<number> {
    const url = new URL(`/api/transactions/sum`, this.apiUrl)
    url.searchParams.set('categoryId', id)
    if (from) {
      url.searchParams.set('from', from.toISOString());
    }
    if (to) {
      url.searchParams.set('to', to.toISOString());
    }
    const res: any = await this.request(url, HttpMethod.GET);
    return res.balance;
  }

  createCategory(id: string, budgetId: string, name: string, description: string, amount: number, isExpense: boolean): Promise<Category> {
    const url = new URL(`/api/categories`, this.apiUrl)
    const body = {
      'id': id,
      'title': name,
      'description': description,
      'amount': amount,
      'expense': isExpense,
      'budgetId': budgetId
    };
    return this.request(url, HttpMethod.POST, body);
  }

  updateCategory(id: string, changes: object): Promise<Category> {
    const url = new URL(`/api/categories/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.PUT, changes);
  }

  deleteCategory(id: string): Promise<void> {
    const url = new URL(`/api/categories/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.DELETE);
  }

  // Transactions
  getTransactions(
    budgetId?: string,
    categoryId?: string,
    count?: number,
    from?: Date,
    to?: Date
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
    if (to) {
      httpParams = httpParams.set('to', to.toISOString());
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

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`, this.options)
      .pipe(map(transaction => {
        transaction.date = new Date(transaction.date);
        return transaction;
      }));
  }

  createTransaction(
    id: string,
    budgetId: string,
    name: string,
    description: string,
    amount: number,
    date: Date,
    expense: boolean,
    category: string
  ): Observable<Transaction> {
    const params = {
      'id': id,
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

  updateTransaction(id: string, changes: object): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, changes, this.options);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`, this.options);
  }

  // Users
  getProfile(id: string): Promise<User> {
    const url = new URL(`/api/users/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.GET)
  }

  getUsersByUsername(username: string): Promise<User[]> {
    return Promise.reject("Not yet implemented")
  }

  private async request<T>(url: URL, method: HttpMethod, body?: any): Promise<T> {
    const headers = {
      'content-type': 'application/json'
    }

    const token = this.storage.getItem('Authorization')
    if (token) {
      headers['authorization'] = `Bearer ${token}`
    }

    let jsonBody: string;
    if (body) {
      jsonBody = JSON.stringify(body)
    }

    const res = await fetch(url, {
      credentials: 'include',
      headers: headers,
      method: method,
      body: jsonBody
    })

    if (res.status === 204) {
      // No content
      return
    }
    return res.json()
  }
}

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
