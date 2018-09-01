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

  /*
  ngAfterViewInit() {
    this.categoryProgressBars.changes.subscribe( list => 
      list.forEach(progressBar =>
        progressBar._elementRef.nativeElement.innerHTML += `
        <style>
        .mat-progress-bar-fill::after {
          background-color: ${this.categories[0].color};
          color: purple;
        }
        </style>
        `
      )
    )
  }
  */

  getCategoryRemainingBalance(category: Category): number {
    let categoryBalance = this.categoryBalances.get(category.id)
    if (!categoryBalance) {
      categoryBalance = 0
    }

    return category.amount + categoryBalance;
  }

  getCategoryCompletion(category: Category): number {
    if (category.amount <= 0) {
      return 0;
    }

    let categoryBalance = this.categoryBalances.get(category.id)
    if (!categoryBalance) {
      categoryBalance = 0
    }

    // Invert the negative/positive values for calculating progress
    // since the limit for a category is saved as a positive but the
    // balance is used in the calculation. 
    if (categoryBalance < 0) {
      categoryBalance = Math.abs(categoryBalance)
    } else {
      categoryBalance -= (categoryBalance * 2)
    }

    return categoryBalance / category.amount * 100;
  }
}
