import { Injectable } from '@angular/core';
import { of, Observable, from } from 'rxjs';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';
import { BudgetDatabase, ITransaction } from './budget-database';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private db: BudgetDatabase,
    private authService: AuthService,
    private apiService: ApiService,
  ) { }

  getTransactions(count?: number): Observable<ITransaction[]> {
    // Check if we have a currently logged in user
    if (this.authService.currentUser) {
      this.apiService.getTransactions().subscribe(
        value => {
          console.log(value);
        },
        error => {
          console.error(error);
        }
      );
    }
    if (count) {
      return from(this.db.transactions.orderBy('date').reverse().limit(count).toArray());
    } else {
      return from(this.db.transactions.orderBy('date').reverse().toArray());
    }
  }

  getTransaction(id: number): Observable<Transaction> {
    return Observable.create(subscriber => {
      this.db.transactions.where('id').equals(id).first().then(transaction => {
        if (!transaction) {
          subscriber.error();
          subscriber.complete();
          return;
        }
        (transaction as Transaction).loadCategory(this.db);
        (transaction as Transaction).loadAccount(this.db);
        subscriber.next(transaction);
      });
    });
  }

  saveTransaction(transaction: Transaction): Observable<Transaction> {
    this.db.transactions.put(transaction);
    if (this.authService.currentUser) {
      return this.apiService.saveTransaction(transaction);
    } else {
      return of(transaction);
    }
  }

  updateTransaction(transaction: Transaction): Observable<any> {
    this.db.transactions.update(transaction.id, transaction);
    return of([]);
  }

  deleteTransaction(transaction: Transaction): Observable<any> {
    return from(this.db.transactions.delete(transaction.id));
  }

  getBalance(): Observable<number> {
    let sum = 0;
    return from(
      this.db.transactions.each(function (transaction) {
        if (transaction.type === TransactionType.INCOME) {
          sum += transaction.amount;
        } else {
          sum -= transaction.amount;
        }
      }).then(function () {
        return sum;
      })
    );
  }
}
