import { Observable } from 'rxjs';
import { Category } from './category';
import { InjectionToken } from '@angular/core';
import { Account } from '../accounts/account';

export interface CategoryService {

  getCategories(accountId: string, count?: number): Observable<Category[]>;

  getCategory(accountId: string, id: string): Observable<Category>;

  createCategory(accountId: string, name: string, amount: number): Observable<Category>;

  updateCategory(accountId: string, id: string, changes: object): Observable<boolean>;

  deleteCategory(accountId: string, id: string): Observable<boolean>;
}

export let CATEGORY_SERVICE = new InjectionToken<CategoryService>('category.service');
