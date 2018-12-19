import { ITransaction } from './budget-database';
import { Category } from './category';
import { TransactionType } from './transaction.type';
import * as firebase from 'firebase/app';

export class Transaction implements ITransaction {
  id: string;
  accountId: string;
  remoteId: string;
  title: string;
  description: string;
  amount: number;
  date: Date = new Date();
  categoryId: string;
  type: TransactionType = TransactionType.EXPENSE;
  category: Category;
  account: Account;

  static fromSnapshotRef(snapshot: firebase.firestore.DocumentSnapshot): Transaction {
    const transaction = new Transaction();
    transaction.id = snapshot.id;
    transaction.title = snapshot.get('name');
    transaction.description = snapshot.get('description');
    transaction.amount = snapshot.get('amount');
    transaction.categoryId = snapshot.get('category');
    transaction.date = snapshot.get('date');
    transaction.type = snapshot.get('isExpense') ? TransactionType.EXPENSE : TransactionType.INCOME;
    return transaction;
  }
}
