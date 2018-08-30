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

  getTransactions(count?: number): Observable<Transaction[]> {
    if (count) {
      return from(this.db.transactions.toCollection().limit(count).toArray())
    } else {
      return from(this.db.transactions.toCollection().toArray())
    }
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

  getBalance(): Observable<number> {
    console.log("Getting balance")
    let sum = 0;
    return from(
      this.db.transactions.each(function(transaction) {
        if (transaction.type === TransactionType.INCOME) {
          sum += transaction.amount
        } else {
          sum -= transaction.amount
        }
      }).then(function() {
        return sum;
      })
    )
  }
}
