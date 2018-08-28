import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionType } from '../transaction.type';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  public transactionType = TransactionType;

  public transactions: Transaction[]
  
  constructor() { }

  ngOnInit() {
    this.getTransactions()
  }

  onScroll() {
    
  }

  getTransactions(): void {
    this.transactions = [
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
  }
}
