import { Injectable } from '@angular/core';
import { User, UserPermission, Permission, AuthToken } from '../users/user';
import { TwigsService } from './twigs.service';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';
import { environment } from '../../environments/environment';
import { Frequency, RecurringTransaction } from '../recurringtransactions/recurringtransaction';

@Injectable({
  providedIn: 'root'
})
export class TwigsHttpService implements TwigsService {

  private options = {
    withCredentials: true
  };
  private apiUrl = environment.apiUrl;

  constructor(
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
  async getTransactions(
    budgetId?: string,
    categoryId?: string,
    count?: number,
    from?: Date,
    to?: Date
  ): Promise<Transaction[]> {
    const url = new URL(`/api/transactions`, this.apiUrl)
    if (budgetId) {
      url.searchParams.set('budgetIds', budgetId);
    }
    if (categoryId) {
      url.searchParams.set('categoryIds', categoryId);
    }
    if (from) {
      url.searchParams.set('from', from.toISOString());
    }
    if (to) {
      url.searchParams.set('to', to.toISOString());
    }
    const transactions: Transaction[] = await this.request(url, HttpMethod.GET)
    transactions.forEach(transaction => {
      transaction.date = new Date(transaction.date);
    })
    return transactions
  }

  async getTransaction(id: string): Promise<Transaction> {
    const url = new URL(`/api/transactions/${id}`, this.apiUrl)
    const transaction: Transaction = await this.request(url, HttpMethod.GET)
    transaction.date = new Date(transaction.date)
    return transaction
  }

  async createTransaction(
    id: string,
    budgetId: string,
    name: string,
    description: string,
    amount: number,
    date: Date,
    expense: boolean,
    category: string
  ): Promise<Transaction> {
    const url = new URL(`/api/transactions`, this.apiUrl)
    const body = {
      'id': id,
      'title': name,
      'description': description,
      'date': date.toISOString(),
      'amount': amount,
      'expense': expense,
      'categoryId': category,
      'budgetId': budgetId
    };
    const transaction: Transaction = await this.request(url, HttpMethod.POST, body)
    transaction.date = new Date(transaction.date)
    return transaction
  }

  async updateTransaction(id: string, transaction: Transaction): Promise<Transaction> {
    const body: any = transaction;
    body.date = transaction.date.toISOString()
    const url = new URL(`/api/transactions/${id}`, this.apiUrl)
    const updatedTransaction: Transaction = await this.request(url, HttpMethod.PUT, body)
    updatedTransaction.date = new Date(updatedTransaction.date)
    return updatedTransaction
  }

  deleteTransaction(id: string): Promise<void> {
    const url = new URL(`/api/transactions/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.DELETE)
  }

  // Recurring Transactions
  async getRecurringTransactions(
    budgetId?: string,
    categoryId?: string,
    count?: number,
    from?: Date,
    to?: Date
  ): Promise<RecurringTransaction[]> {
    const url = new URL(`/api/recurringtransactions`, this.apiUrl)
    if (budgetId) {
      url.searchParams.set('budgetIds', budgetId);
    }
    if (categoryId) {
      url.searchParams.set('categoryIds', categoryId);
    }
    if (from) {
      url.searchParams.set('from', from.toISOString());
    }
    if (to) {
      url.searchParams.set('to', to.toISOString());
    }
    const transactions: RecurringTransaction[] = await this.request(url, HttpMethod.GET)
    transactions.forEach(transaction => {
      transaction.frequency = Frequency.parse(transaction.frequency as any)
    })
    return transactions
  }

  async getRecurringTransaction(id: string): Promise<RecurringTransaction> {
    const url = new URL(`/api/recurringtransactions/${id}`, this.apiUrl)
    const transaction: RecurringTransaction = await this.request(url, HttpMethod.GET)
    transaction.frequency = Frequency.parse(transaction.frequency as any)
    return transaction
  }

  async createRecurringTransaction(
    id: string,
    budgetId: string,
    name: string,
    description: string,
    amount: number,
    frequency: Frequency,
    start: Date,
    expense: boolean,
    category: string,
    end?: Date,
  ): Promise<RecurringTransaction> {
    const url = new URL(`/api/transactions`, this.apiUrl)
    const body = {
      'id': id,
      'title': name,
      'description': description,
      'frequency': frequency.toString(),
      'start': start.toISOString(),
      'finish': end?.toISOString(),
      'amount': amount,
      'expense': expense,
      'categoryId': category,
      'budgetId': budgetId
    };
    const transaction: RecurringTransaction = await this.request(url, HttpMethod.POST, body)
    transaction.frequency = Frequency.parse(transaction.frequency as any)
    return transaction
  }

  async updateRecurringTransaction(id: string, transaction: RecurringTransaction): Promise<RecurringTransaction> {
    const body: any = transaction;
    body.frequency = transaction.frequency.toString()
    const url = new URL(`/api/transactions/${id}`, this.apiUrl)
    const updatedTransaction: RecurringTransaction = await this.request(url, HttpMethod.PUT, body)
    updatedTransaction.frequency = Frequency.parse(updatedTransaction.frequency as any)
    return updatedTransaction
  }

  deleteRecurringTransaction(id: string): Promise<void> {
    const url = new URL(`/api/recurringtransactions/${id}`, this.apiUrl)
    return this.request(url, HttpMethod.DELETE)
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
