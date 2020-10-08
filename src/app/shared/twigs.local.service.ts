import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { User, UserPermission } from '../users/user';
import { TwigsService } from './twigs.service';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';

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

  private users: User[] = [new User(1, 'test', 'test@example.com')];
  private budgets: Budget[] = [];
  private transactions: Transaction[] = [];
  private categories: Category[] = [];

  // Auth
  login(email: string, password: string): Observable<User> {
    return Observable.create(subscriber => {
      const filteredUsers = this.users.filter(user => {
        return (user.email === email || user.username === email);
      });
      if (filteredUsers.length !== 0) {
        subscriber.next(filteredUsers[0]);
      } else {
        subscriber.error('No users found');
      }
    });
  }

  register(username: string, email: string, password: string): Observable<User> {
    return Observable.create(subscriber => {
      const user = new User();
      user.username = username;
      user.email = email;
      user.id = this.users.length + 1;
      this.users.push(user);
      subscriber.next(user);
      subscriber.complete();
    });
  }

  logout(): Observable<void> {
    return Observable.create(subscriber => {
      subscriber.complete();
    });
  }

  // Budgets
  getBudgets(): Observable<Budget[]> {
    return Observable.create(subscriber => {
      subscriber.next(this.budgets);
      subscriber.complete();
    });
  }

  getBudget(id: number): Observable<Budget> {
    return Observable.create(subscriber => {
      const budget = this.budgets.filter(it => {
        return it.id === id;
      })[0];
      if (budget) {
        subscriber.next(budget);
      } else {
        subscriber.error('No budget found for given id');
      }
      subscriber.complete();
    });
  }

  createBudget(
    name: string,
    description: string,
    users: UserPermission[],
  ): Observable<Budget> {
    return Observable.create(subscriber => {
      const budget = new Budget();
      budget.name = name;
      budget.description = description;
      budget.users = users;
      budget.id = this.budgets.length + 1;
      this.budgets.push(budget);
      subscriber.next(budget);
      subscriber.complete();
    });
  }

  updateBudget(id: number, changes: object): Observable<Budget> {
    return Observable.create(subscriber => {
      const budget = this.budgets.filter(it => {
        return it.id === id;
      })[0];
      if (budget) {
        const index = this.budgets.indexOf(budget);
        this.updateValues(
          budget,
          changes,
          [
            'name',
            'description',
            'users',
          ]
        );
        this.budgets[index] = budget;
        subscriber.next(budget);
      } else {
        subscriber.error('No budget found for given id');
      }
      subscriber.complete();
    });
  }

  deleteBudget(id: number): Observable<void> {
    return Observable.create(subscriber => {
      const budget = this.budgets.filter(it => {
        return budget.id === id;
      })[0];
      if (budget) {
        const index = this.budgets.indexOf(budget);
        delete this.budgets[index];
        subscriber.complete();
      } else {
        subscriber.error('No budget found for given id');
      }
    });
  }

  // Categories
  getCategories(budgetId: number, count?: number): Observable<Category[]> {
    return Observable.create(subscriber => {
      subscriber.next(this.categories.filter(category => {
        return category.budgetId === budgetId;
      }));
      subscriber.complete();
    });
  }

  getCategory(id: number): Observable<Category> {
    return Observable.create(subscriber => {
      subscriber.next(this.findById(this.categories, id));
      subscriber.complete();
    });
  }

  createCategory(budgetId: number, name: string, description: string, amount: number, isExpense: boolean): Observable<Category> {
    return Observable.create(subscriber => {
      const category = new Category();
      category.title = name;
      category.description = description;
      category.amount = amount;
      category.expense = isExpense;
      category.budgetId = budgetId;
      category.id = this.categories.length + 1;
      this.categories.push(category);
      subscriber.next(category);
      subscriber.complete();
    });
  }

  updateCategory(budgetId: number, id: number, changes: object): Observable<Category> {
    return Observable.create(subscriber => {
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
        subscriber.next(category);
      } else {
        subscriber.error('No category found for given id');
      }
      subscriber.complete();
    });
  }

  deleteCategory(budgetId: number, id: number): Observable<void> {
    return Observable.create(subscriber => {
      const category = this.findById(this.categories, id);
      if (category) {
        const index = this.categories.indexOf(category);
        delete this.transactions[index];
        subscriber.complete();
      } else {
        subscriber.error('No category found for given id');
      }
    });
  }

  // Transactions
  getTransactions(budgetId?: number, categoryId?: number, count?: number): Observable<Transaction[]> {
    return Observable.create(subscriber => {
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

  getTransaction(id: number): Observable<Transaction> {
    return Observable.create(subscriber => {
      subscriber.next(this.findById(this.transactions, id));
      subscriber.complete();
    });
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
    return Observable.create(subscriber => {
      const transaction = new Transaction();
      transaction.title = name;
      transaction.description = description;
      transaction.amount = amount;
      transaction.date = date;
      transaction.expense = isExpense;
      transaction.categoryId = category;
      transaction.budgetId = budgetId;
      transaction.id = this.transactions.length + 1;
      this.transactions.push(transaction);
      subscriber.next(transaction);
      subscriber.complete();
    });
  }

  updateTransaction(budgetId: number, id: number, changes: object): Observable<Transaction> {
    return Observable.create(subscriber => {
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

  deleteTransaction(budgetId: number, id: number): Observable<void> {
    return Observable.create(subscriber => {
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
  getProfile(): Observable<User> {
    return Observable.create(subscriber => {
      subscriber.error("Not yet implemented")
    });
  }

  getUsersByUsername(username: string): Observable<User[]> {
    return Observable.create(subscriber => {
      subscriber.next(this.users.filter(user => user.username.indexOf(username) > -1 ));
    });
  }

  private updateValues(old: object, changes: object, keys: string[]) {
    keys.forEach(key => {
      if (changes[key]) {
        old[key] = changes[key];
      }
    });
  }

  private findById<T>(items: T[], id: number): T {
    return items.filter(item => {
      return item['id'] === id;
    })[0];
  }
}
