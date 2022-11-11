import { InjectionToken } from '@angular/core';
import { User, UserPermission } from '../users/user';
import { Budget } from '../budgets/budget';
import { Category } from '../categories/category';
import { Transaction } from '../transactions/transaction';

export interface TwigsService {
  // Auth
  login(email: string, password: string): Promise<User>;
  register(username: string, email: string, password: string): Promise<User>;
  logout(): Promise<void>;

  // Budgets
  getBudgets(): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget>;
  getBudgetBalance(id: string, from?: Date, to?: Date): Promise<number>;
  createBudget(
    id: string,
    name: string,
    description: string,
    users: UserPermission[],
  ): Promise<Budget>;
  updateBudget(id: string, budget: Budget): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;

  // Categories
  getCategories(budgetId?: string, count?: number): Promise<Category[]>;
  getCategory(id: string): Promise<Category>;
  getCategoryBalance(id: string, from?: Date, to?: Date): Promise<number>;
  createCategory(id: string, budgetId: string, name: string, description: string, amount: number, isExpense: boolean): Promise<Category>;
  updateCategory(id: string, category: Category): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Transactions
  getTransactions(
    budgetId?: string,
    categoryId?: string,
    count?: number,
    from?: Date,
    to?: Date
  ): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction>;
  createTransaction(
    id: string,
    budgetId: string,
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: string
  ): Promise<Transaction>;
  updateTransaction(id: string, transaction: Transaction): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;

  getProfile(id: string): Promise<User>;
  getUsersByUsername(username: string): Promise<User[]>;
}

export let TWIGS_SERVICE = new InjectionToken<TwigsService>('twigs.service');
