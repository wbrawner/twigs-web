export class Transaction {
  id: number;
  title: string;
  description: string = null;
  date: Date = new Date();
  amount: number;
  isExpense: boolean;
  categoryId: number;
  budgetId: number;
  createdBy: number;
}
