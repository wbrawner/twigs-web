import { uuidv4 } from '../shared/utils';

export class Transaction {
  id: string = uuidv4();
  title: string;
  description: string = null;
  date: Date = new Date();
  amount: number;
  expense = true;
  categoryId: string;
  budgetId: string;
  createdBy: string;
}
