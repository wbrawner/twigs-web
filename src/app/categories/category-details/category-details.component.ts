import { Component, OnInit, Input } from '@angular/core';
import { CategoryServiceFirebaseFirestoreImpl } from '../category.service.firestore';
import { Category } from '../category';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/accounts/account';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  accountId: string;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryServiceFirebaseFirestoreImpl
  ) { }

  ngOnInit() {
    this.getCategory();
  }

  getCategory(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryService.getCategory(this.accountId, id)
      .subscribe(category => {
        category.amount /= 100;
        this.category = category;
      });
  }
}
