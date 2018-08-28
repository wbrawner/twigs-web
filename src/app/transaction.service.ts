import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }

  getTransactions(): Observable<Transaction[]> {
    return of([
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
    ])
  }
}
