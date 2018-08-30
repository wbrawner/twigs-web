import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service'
import { Category } from '../category'
import { Location } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories: Category[];
  private categoryBalances: Map<number, number>;

  constructor(
    private categoryService: CategoryService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCategories();
    this.categoryBalances = new Map();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories
      for (let category of this.categories) {
        this.categoryService.getBalance(category).subscribe(balance => this.categoryBalances.set(category.id,  balance))
      }
    })
  }

  goBack(): void {
    this.location.back()
  }
}
