import { ITransaction } from './budget-database'
import { ICategory } from './budget-database'
import { TransactionType } from './transaction.type';

export class Transaction implements ITransaction {
    id: number;
    title: string;
    description: string;
    amount: number;
    date: Date = new Date();
    category: ICategory;
    type: TransactionType = TransactionType.EXPENSE;
}
