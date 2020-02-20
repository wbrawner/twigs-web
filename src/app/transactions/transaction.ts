export class Transaction {
  id: number;
  title: string;
  description: string = null;
  date: Date = new Date();
  amount: number;
  expense = true;
  categoryId: number;
  budgetId: number;
  createdBy: number;
}
