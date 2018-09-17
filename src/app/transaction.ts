import { ITransaction, ICategory, BudgetDatabase, IAccount } from './budget-database';
import { Category } from './category';
import { TransactionType } from './transaction.type';

export class Transaction implements ITransaction {
    id: number;
    accountId: number;
    remoteId: number;
    title: string;
    description: string;
    amount: number;
    date: Date = new Date();
    categoryId: number;
    type: TransactionType = TransactionType.EXPENSE;
    category: ICategory;
    account: IAccount;

    loadCategory(db: BudgetDatabase) {
      db.categories.where('id').equals(this.categoryId).first().then(category => {
        this.category = category;
      });
    }

    loadAccount(db: BudgetDatabase) {
      db.accounts.where('id').equals(this.accountId).first().then(account => {
        this.account = account;
      });
    }
}
