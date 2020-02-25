import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserPermission } from '../users/user';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';

export interface TwigsService {
  // Auth
  login(email: string, password: string): Observable<User>;
  register(username: string, email: string, password: string): Observable<User>;
  logout(): Observable<void>;

  // Budgets
  getBudgets(): Observable<Budget[]>;
  getBudget(id: number): Observable<Budget>;
  createBudget(
    name: string,
    description: string,
    users: UserPermission[],
  ): Observable<Budget>;
  updateBudget(id: number, changes: object): Observable<Budget>;
  deleteBudget(id: number): Observable<void>;

  // Categories
  getCategories(budgetId?: number, count?: number): Observable<Category[]>;
  getCategory(id: number): Observable<Category>;
  createCategory(budgetId: number, name: string, amount: number, isExpense: boolean): Observable<Category>;
  updateCategory(budgetId: number, id: number, changes: object): Observable<Category>;
  deleteCategory(budgetId: number, id: number): Observable<void>;

  // Transactions
  getTransactions(budgetId?: number, categoryId?: number, count?: number): Observable<Transaction[]>;
  getTransaction(id: number): Observable<Transaction>;
  createTransaction(
    budgetId: number,
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: number
  ): Observable<Transaction>;
  updateTransaction(budgetId: number, id: number, changes: object): Observable<Transaction>;
  deleteTransaction(budgetId: number, id: number): Observable<void>;

  getProfile(): Observable<User>;
  getUsersByUsername(username: string): Observable<User[]>;
}

export let TWIGS_SERVICE = new InjectionToken<TwigsService>('twigs.service');
