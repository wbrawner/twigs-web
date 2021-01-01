import { uuidv4 } from '../shared/utils';

export class Category {
  id: string = uuidv4();
  title: string;
  description: string;
  amount: number;
  expense: boolean;
  archived: boolean;
  budgetId: string;
}
