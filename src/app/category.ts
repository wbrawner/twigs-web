import { ICategory } from './budget-database'
import { CategoryType } from './category.type'

export class Category implements ICategory {
  id: number;
  name: string;
  amount: number;
  repeat: string;
  color: string;
  type: CategoryType = CategoryType.LIMIT;
}
