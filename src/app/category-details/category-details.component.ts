import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service'
import { Category } from '../category'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.getCategory()
  }

  getCategory(): void {
    const id = +this.route.snapshot.paramMap.get('id')
    this.categoryService.getCategory(id)
    .subscribe(category => this.category = category)
  }
}
