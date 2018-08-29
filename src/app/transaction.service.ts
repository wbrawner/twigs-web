import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactions: Transaction[] = [
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Spent some money", title: "An Expense", type: TransactionType.EXPENSE, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Earned some money", title: "Some Income", type: TransactionType.INCOME, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Spent some money", title: "An Expense", type: TransactionType.EXPENSE, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Earned some money", title: "Some Income", type: TransactionType.INCOME, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Spent some money", title: "An Expense", type: TransactionType.EXPENSE, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Earned some money", title: "Some Income", type: TransactionType.INCOME, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Spent some money", title: "An Expense", type: TransactionType.EXPENSE, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Earned some money", title: "Some Income", type: TransactionType.INCOME, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Spent some money", title: "An Expense", type: TransactionType.EXPENSE, categoryId: 0},
    {id: 0, amount: Math.random() * 100, date: new Date(), description: "Earned some money", title: "Some Income", type: TransactionType.INCOME, categoryId: 0},
  ]

  constructor() { }

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions)
  }

  saveTransaction(transaction: Transaction): Observable<Transaction> {
    // TODO: Replace this with a DB save method
    var newId = 0;
    for (let transaction of this.transactions) {
      if (transaction.id > newId) {
        newId = transaction.id + 1;
      }
    }
    transaction.id = newId;
    this.transactions.push(transaction)
    return of(transaction)
  }
}
