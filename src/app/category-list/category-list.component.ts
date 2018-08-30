import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../category'

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  @Input() categories: Category[];
  @Input() categoryBalances: Map<number, number>;

  constructor() { }

  ngOnInit() {
  }

  getCategoryCompletion(category: Category): number {
    if (category.amount <= 0) {
      return 0;
    }

    let categoryBalance = this.categoryBalances.get(category.id)
    if (!categoryBalance) {
      categoryBalance = 0
    }

    return categoryBalance / category.amount;
  }
}
