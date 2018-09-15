import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Account } from './account'
import { Category } from './category'
import { Transaction } from './transaction'
import { TransactionType } from './transaction.type';

@Injectable({
    providedIn: 'root'
})
export class BudgetDatabase extends Dexie {
    transactions: Dexie.Table<ITransaction, number>;
    categories: Dexie.Table<ICategory, number>;
    accounts: Dexie.Table<IAccount, number>;

    constructor() {
        super('BudgetDatabase')
        this.version(1).stores({
            transactions: `++id, title, description, amount, date, category, type`,
            categories: `++id, name, amount, repeat, color`
        })
        this.version(2).stores({
            transactions: `++id, title, description, amount, date, category_id, type`,
            categories: `++id, name, amount, repeat, color, type`
        })
        this.version(3).stores({
            transactions: `++id, title, description, amount, date, category_id, type`,
            categories: `++id, name, amount, repeat, color`
        })
        this.version(4).stores({
            transactions: `++id, remote_id, account_id, title, description, amount, date, category_id, type`,
            categories: `++id, remote_id, account_id, name, amount, repeat, color`,
            accounts: `++id, remote_id, name`
      })
        this.transactions.mapToClass(Transaction)
        this.categories.mapToClass(Category)
        this.accounts.mapToClass(Account)
    }
}

export interface ITransaction {
    id: number;
    accountId: number;
    remoteId: number;
    title: string;
    description: string;
    amount: number;
    date: Date;
    categoryId: number;
    type: TransactionType;
}

export interface ICategory {
    id: number;
    accountId: number;
    remoteId: number;
    name: string;
    amount: number;
    repeat: string;
    color: string;
}

export interface IAccount {
    id: number;
    remoteId: number;
    name: string;
}
