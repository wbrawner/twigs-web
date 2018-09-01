import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Category } from './category'
import { CategoryType } from './category.type';
import { Transaction } from './transaction'
import { TransactionType } from './transaction.type';

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
      categories: `++id, name, amount, repeat, color`
    })
    this.version(2).stores({
      transactions: `++id, title, description, amount, date, category_id, type`,
      categories: `++id, name, amount, repeat, color, type`
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
  categoryId: number;
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
