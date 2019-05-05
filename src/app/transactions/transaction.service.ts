import { Observable } from 'rxjs';
import { Transaction } from './transaction';
import { InjectionToken } from '@angular/core';
import { Account } from '../accounts/account';

export interface TransactionService {

  getTransactions(accountId: string, categoryId?: string, count?: number): Observable<Transaction[]>;

  getTransaction(accountId: string, id: string): Observable<Transaction>;

  createTransaction(
    accountId: string,
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: string
  ): Observable<Transaction>;

  updateTransaction(accountId: string, id: string, changes: object): Observable<boolean>;

  deleteTransaction(accountId: string, id: string): Observable<boolean>;
}

export let TRANSACTION_SERVICE = new InjectionToken<TransactionService>('transaction.service');
