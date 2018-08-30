import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from '../category.service'
import { Category } from '../category'
import { CategoryType } from '../category.type'
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit {

  @Input() title: string;
  @Input() currentCategory: Category;
  public categoryType = CategoryType;

  constructor(
    private categoryService: CategoryService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back()
  }

  save(): void {
    if (this.currentCategory.id) {
      // This is an existing category, update it
      this.categoryService.updateCategory(this.currentCategory);
    } else {
      // This is a new category, save it
      this.categoryService.saveCategory(this.currentCategory);
    }
    this.goBack()
  }

  delete(): void {
    this.categoryService.deleteCategory(this.currentCategory);
    this.goBack()
  }
}
