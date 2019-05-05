export class Category {
  id: string;
  name: string;
  amount: number;
  isExpense: boolean;
  accountId: string;

  static fromSnapshotRef(accountId: string, snapshot: firebase.firestore.DocumentSnapshot): Category {
    const category = new Category();
    category.id = snapshot.id;
    category.name = snapshot.get('name');
    category.amount = snapshot.get('amount');
    let isExpense = snapshot.get('isExpense');
    if (isExpense === undefined) {
      isExpense = true;
    }
    category.isExpense = isExpense;
    category.accountId = accountId;
    return category;
  }
}
