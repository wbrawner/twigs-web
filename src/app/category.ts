import { ICategory } from './budget-database'

export class Category implements ICategory {
  id: number;
  name: string;
  amount: number;
  repeat: string;
  color: string;
}
