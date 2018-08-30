import { ITransaction } from './budget-database'
import { Category } from './category'
import { TransactionType } from './transaction.type';

export class Transaction implements ITransaction {
    id: number;
    title: string;
    description: string;
    amount: number;
    date: Date = new Date();
    categoryId: number;
    type: TransactionType = TransactionType.EXPENSE;
}
