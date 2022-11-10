import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { User, UserPermission } from '../users/user';
import { TwigsService } from './twigs.service';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';
import { randomId } from '../shared/utils';

/**
 * This is intended to be a very simple implementation of the TwigsService used for testing out the UI and quickly iterating on it.
 * It may also prove useful for automated testing.
 */
@Injectable({
  providedIn: 'root'
})
export class TwigsLocalService implements TwigsService {

  constructor(
    private http: HttpClient
  ) { }

  private users: User[] = [new User(randomId(), 'test', 'test@example.com')];
  private budgets: Budget[] = [];
  private transactions: Transaction[] = [];
  private categories: Category[] = [];

  // Auth
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const filteredUsers = this.users.filter(user => {
        return (user.email === email || user.username === email);
      });
      if (filteredUsers.length !== 0) {
        resolve(filteredUsers[0]);
      } else {
        reject('No users found');
      }
    });
  }

  register(username: string, email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = new User();
      user.username = username;
      user.email = email;
      user.id = randomId();
      this.users.push(user);
      resolve(user);
    });
  }

  logout(): Promise<void> {
    return Promise.resolve()
  }

  // Budgets
  getBudgets(): Promise<Budget[]> {
    return Promise.resolve(this.budgets)
  }

  getBudgetBalance(id: string, from?: Date, to?: Date): Promise<number> {
    return Promise.resolve(200)
  }

  getBudget(id: string): Promise<Budget> {
    return new Promise((resolve, reject) => {
      const budget = this.budgets.filter(it => {
        return it.id === id;
      })[0];
      if (budget) {
        resolve(budget);
      } else {
        reject('No budget found for given id');
      }
    });
  }

  createBudget(
    id: string,
    name: string,
    description: string,
    users: UserPermission[],
  ): Promise<Budget> {
    return new Promise((resolve, reject) => {
      const budget = new Budget();
      budget.name = name;
      budget.description = description;
      budget.users = users;
      budget.id = id;
      this.budgets.push(budget);
      resolve(budget);
    });
  }

  updateBudget(id: string, budget: Budget): Promise<Budget> {
    return new Promise((resolve, reject) => {
      const budget = this.budgets.filter(it => {
        return it.id === id;
      })[0];
      if (budget) {
        const index = this.budgets.indexOf(budget);
        this.updateValues(
          budget,
          budget,
          [
            'name',
            'description',
            'users',
          ]
        );
        this.budgets[index] = budget;
        resolve(budget);
      } else {
        reject('No budget found for given id');
      }
    });
  }

  deleteBudget(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const budget = this.budgets.filter(it => {
        return budget.id === id;
      })[0];
      if (budget) {
        const index = this.budgets.indexOf(budget);
        delete this.budgets[index];
        resolve();
      } else {
        reject('No budget found for given id');
      }
    });
  }

  // Categories
  getCategories(budgetId: string, count?: number): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      resolve(this.categories.filter(category => {
        return category.budgetId === budgetId;
      }));
    });
  }

  getCategory(id: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      resolve(this.findById(this.categories, id));
    });
  }

  getCategoryBalance(id: string, from?: Date, to?: Date): Promise<number> {
    return Promise.resolve(20);
  }

  createCategory(id: string, budgetId: string, name: string, description: string, amount: number, isExpense: boolean): Promise<Category> {
    return new Promise((resolve, reject) => {
      const category = new Category();
      category.title = name;
      category.description = description;
      category.amount = amount;
      category.expense = isExpense;
      category.budgetId = budgetId;
      category.id = id;
      this.categories.push(category);
      resolve(category);
    });
  }

  updateCategory(id: string, changes: object): Promise<Category> {
    return new Promise((resolve, reject) => {
      const category = this.findById(this.categories, id);
      if (category) {
        const index = this.categories.indexOf(category);
        this.updateValues(
          category,
          changes,
          [
            'name',
            'amount',
            'isExpense',
            'budgetId',
          ]
        );
        this.categories[index] = category;
        resolve(category);
      } else {
        reject('No category found for given id');
      }
    });
  }

  deleteCategory(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const category = this.findById(this.categories, id);
      if (category) {
        const index = this.categories.indexOf(category);
        delete this.transactions[index];
        resolve();
      } else {
        reject('No category found for given id');
      }
    });
  }

  // Transactions
  getTransactions(budgetId?: string, categoryId?: string, count?: number): Observable<Transaction[]> {
    return new Observable(subscriber => {
      subscriber.next(this.transactions.filter(transaction => {
        let include = true;
        if (budgetId) {
          include = transaction.budgetId === budgetId;
        }
        if (include && categoryId) {
          include = transaction.categoryId === categoryId;
        }
        return include;
      }));
      subscriber.complete();
    });
  }

  getTransaction(id: string): Observable<Transaction> {
    return new Observable(subscriber => {
      subscriber.next(this.findById(this.transactions, id));
      subscriber.complete();
    });
  }

  createTransaction(
    id: string,
    budgetId: string,
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: string
  ): Observable<Transaction> {
    return new Observable(subscriber => {
      const transaction = new Transaction();
      transaction.title = name;
      transaction.description = description;
      transaction.amount = amount;
      transaction.date = date;
      transaction.expense = isExpense;
      transaction.categoryId = category;
      transaction.budgetId = budgetId;
      transaction.id = randomId();
      this.transactions.push(transaction);
      subscriber.next(transaction);
      subscriber.complete();
    });
  }

  updateTransaction(id: string, changes: object): Observable<Transaction> {
    return new Observable(subscriber => {
      const transaction = this.findById(this.transactions, id);
      if (transaction) {
        const index = this.transactions.indexOf(transaction);
        this.updateValues(
          transaction,
          changes,
          [
            'title',
            'description',
            'date',
            'amount',
            'isExpense',
            'categoryId',
            'budgetId',
            'createdBy'
          ]
        );
        this.transactions[index] = transaction;
        subscriber.next(transaction);
      } else {
        subscriber.error('No transaction found for given id');
      }
      subscriber.complete();
    });
  }

  deleteTransaction(id: string): Observable<void> {
    return new Observable(subscriber => {
      const transaction = this.findById(this.transactions, id);
      if (transaction) {
        const index = this.transactions.indexOf(transaction);
        delete this.transactions[index];
        subscriber.complete();
      } else {
        subscriber.error('No transaction found for given id');
      }
    });
  }

  // Users
  getProfile(id: string): Promise<User> {
    return Promise.reject("Not yet implemented");
  }

  getUsersByUsername(username: string): Promise<User[]> {
    return Promise.resolve(this.users.filter(user => user.username.indexOf(username) > -1))
  }

  private updateValues(old: object, changes: object, keys: string[]) {
    keys.forEach(key => {
      if (changes[key]) {
        old[key] = changes[key];
      }
    });
  }

  private findById<T>(items: T[], id: string): T {
    return items.filter(item => {
      return item['id'] === id;
    })[0];
  }
}
