import { Observable } from 'rxjs';
import { Category } from './category';
import { InjectionToken } from '@angular/core';

export interface CategoryService {

  getCategories(group: string, count?: number): Observable<Category[]>;

  getCategory(id: string): Observable<Category>;

  createCategory(name: string, amount: number, group: string): Observable<Category>;

  updateCategory(id: string, changes: object): Observable<boolean>;

  deleteCategory(id: string): Observable<boolean>;
}

export let CATEGORY_SERVICE = new InjectionToken<CategoryService>('category.service');
