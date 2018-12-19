import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { Category } from '../category';
import { Actionable } from '../actionable';
import { AppComponent } from '../app.component';
import { CATEGORY_SERVICE, CategoryService } from '../category.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit, Actionable, OnDestroy {

  @Input() title: string;
  @Input() currentCategory: Category;
  @Input() group: string;

  constructor(
    private app: AppComponent,
    @Inject(CATEGORY_SERVICE) private categoryService: CategoryService,
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
    this.currentCategory.amount *= 100;
    let observable;
    if (this.currentCategory.id) {
      // This is an existing category, update it
      observable = this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory);
    } else {
      // This is a new category, save it
      observable = this.categoryService.createCategory(this.currentCategory.name, this.currentCategory.amount, this.app.group);
    }
    observable.subscribe(val => {
      this.app.goBack();
    });
  }

  getActionLabel(): string {
    return 'Save';
  }

  delete(): void {
    this.categoryService.deleteCategory(this.currentCategory.id);
    this.app.goBack();
  }
}
