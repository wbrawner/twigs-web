import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { TransactionType } from './transaction.type';
import { Category } from './category'
import { Transaction } from './transaction'

@Injectable({
  providedIn: 'root'
})
export class BudgetDatabase extends Dexie {
  transactions: Dexie.Table<ITransaction, number>;
  categories: Dexie.Table<ICategory, number>;

  constructor () {
    super('BudgetDatabase')
    this.version(1).stores({
      transactions: `++id, title, description, amount, date, category, type`,
      categories: `++id, name, amount, repeat, color, type-`
    })
    this.transactions.mapToClass(Transaction)
    this.categories.mapToClass(Category)
  }
}

export interface ITransaction {
  id: number;
  title: string;
  description: string;
  amount: number;
  date: Date;
  category: ICategory;
  type: TransactionType;
}

export interface ICategory{
  id: number;
  name: string;
  amount: number;
  repeat: string;
  color: string;
  type: CategoryType;
}
