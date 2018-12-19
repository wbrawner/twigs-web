import { Component, OnInit } from '@angular/core';
import { CategoryServiceFirebaseFirestoreImpl } from '../category.service.firestore';
import { Category } from '../category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryServiceFirebaseFirestoreImpl
  ) { }

  ngOnInit() {
    this.getCategory();
  }

  getCategory(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryService.getCategory(id)
      .subscribe(category => {
        category.amount /= 100;
        this.category = category;
      });
  }
}
