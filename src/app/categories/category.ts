export class Category {
  id: string;
  name: string;
  amount: number;
  repeat: string;
  color: string;
  accountId: string;

  static fromSnapshotRef(accountId: string, snapshot: firebase.firestore.DocumentSnapshot): Category {
    const category = new Category();
    category.id = snapshot.id;
    category.name = snapshot.get('name');
    category.amount = snapshot.get('amount');
    category.accountId = accountId;
    return category;
  }
}
