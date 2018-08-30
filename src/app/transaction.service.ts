import { Injectable } from '@angular/core';
import { of, Observable, from } from 'rxjs';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';
import { BudgetDatabase } from './budget-database';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  db: BudgetDatabase;

  constructor() { 
    this.db = new BudgetDatabase();
  }

  getTransactions(): Observable<Transaction[]> {
    return from(this.db.transactions.toCollection().toArray())
  }

  getTransaction(id: number): Observable<Transaction> {
    return from(this.db.transactions.where('id').equals(id).first())
  }

  saveTransaction(transaction: Transaction): Observable<Transaction> {
    this.db.transactions.put(transaction)
    return of(transaction)
  }

  updateTransaction(transaction: Transaction): Observable<any> {
    this.db.transactions.update(transaction.id, transaction)
    return of([])
  }

  deleteTransaction(transaction: Transaction): Observable<any> {
    return from(this.db.transactions.delete(transaction.id))
  }
}
