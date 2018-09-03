import { Injectable } from '@angular/core';
import { of, Observable, from } from 'rxjs';
import { BudgetDatabase } from './budget-database';
import { TransactionType } from './transaction.type'
import { Category } from './category'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: BudgetDatabase) { }

  getCategories(count?: number): Observable<Category[]> {
    let collection = this.db.categories.orderBy('name');
    if (count) {
      return from(collection.limit(count).toArray())
    } else {
      return from(collection.toArray())
    }
  }

  getCategory(id: number): Observable<Category> {
    return from(this.db.categories.where('id').equals(id).first())
  }

  saveCategory(category: Category): Observable<Category> {
    this.db.categories.put(category)
    return of(category)
  }

  updateCategory(category: Category): Observable<any> {
    this.db.categories.update(category.id, category)
    return of([])
  }

  deleteCategory(category: Category): Observable<any> {
    return from(this.db.categories.delete(category.id))
  }

  getBalance(category: Category): Observable<number> {
    let sum = 0;
    return from(
      this.db.transactions.filter(transaction => transaction.categoryId === category.id).each(function (transaction) {
        if (transaction.type === TransactionType.INCOME) {
          sum += transaction.amount
        } else {
          sum -= transaction.amount
        }
      }).then(function () {
        return sum;
      })
    )
  }
}
