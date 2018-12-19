import { ICategory } from './budget-database';

export class Category implements ICategory {
  id: string;
  accountId: string;
  remoteId: string;
  name: string;
  amount: number;
  repeat: string;
  color: string;

  static fromSnapshotRef(snapshot: firebase.firestore.DocumentSnapshot): Category {
    const category = new Category();
    category.id = snapshot.id;
    category.name = snapshot.get('name');
    category.amount = snapshot.get('amount');
    category.accountId = snapshot.get('group');
    return category;
  }
}
