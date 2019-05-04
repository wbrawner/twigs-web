import { Observable } from 'rxjs';
import { Transaction } from './transaction';
import { InjectionToken } from '@angular/core';

export interface TransactionService {

  getTransactions(group: string, count?: number): Observable<Transaction[]>;

  getTransactionsForCategory(category: string, count?: number): Observable<Transaction[]>;

  getTransaction(id: string): Observable<Transaction>;

  createTransaction(
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: string
  ): Observable<Transaction>;

  updateTransaction(id: string, changes: object): Observable<boolean>;

  deleteTransaction(id: string): Observable<boolean>;
}

export let TRANSACTION_SERVICE = new InjectionToken<TransactionService>('transaction.service');
