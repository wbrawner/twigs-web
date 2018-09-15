import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories: Category[];
  public categoryBalances: Map<number, number>;

  constructor(
    private app: AppComponent,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.app.title = 'Categories';
    this.getCategories();
    this.categoryBalances = new Map();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      for (const category of this.categories) {
        this.categoryService.getBalance(category).subscribe(balance => this.categoryBalances.set(category.id,  balance))
      }
    });
  }
}
