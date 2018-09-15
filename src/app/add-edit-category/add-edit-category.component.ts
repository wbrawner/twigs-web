import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CategoryService } from '../category.service'
import { Category } from '../category'
import { Location } from '@angular/common';
import { Actionable } from '../actionable';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit, Actionable, OnDestroy {

  @Input() title: string;
  @Input() currentCategory: Category;

  constructor(
    private app: AppComponent,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.app.actionable = this;
    this.app.backEnabled = true;
    this.app.title = this.title;
  }

  ngOnDestroy() {
    this.app.actionable = null;
  }

  doAction(): void {
    if (this.currentCategory.id) {
      // This is an existing category, update it
      this.categoryService.updateCategory(this.currentCategory);
    } else {
      // This is a new category, save it
      this.categoryService.saveCategory(this.currentCategory);
    }
    this.app.goBack();
  }

  getActionLabel(): string {
    return 'Save';
  }

  delete(): void {
    this.categoryService.deleteCategory(this.currentCategory);
    this.app.goBack();
  }
}
