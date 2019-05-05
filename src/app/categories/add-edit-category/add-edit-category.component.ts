import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { Category } from '../category';
import { CATEGORY_SERVICE, CategoryService } from '../category.service';
import { Actionable } from 'src/app/actionable';
import { AppComponent } from 'src/app/app.component';
import { Account } from 'src/app/accounts/account';
import { ACCOUNT_SERVICE, AccountService } from 'src/app/accounts/account.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit, Actionable, OnDestroy {

  @Input() accountId: string;
  @Input() title: string;
  @Input() currentCategory: Category;

  constructor(
    private app: AppComponent,
    @Inject(ACCOUNT_SERVICE) private accountService: AccountService,
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
    let observable;
    if (this.currentCategory.id) {
      // This is an existing category, update it
      observable = this.categoryService.updateCategory(
        this.accountId,
        this.currentCategory.id,
        {
          name: this.currentCategory.name,
          amount: this.currentCategory.amount * 100
        }
      );
    } else {
      // This is a new category, save it
      observable = this.categoryService.createCategory(
        this.accountId,
        this.currentCategory.name,
        this.currentCategory.amount
      );
    }
    observable.subscribe(val => {
      this.app.goBack();
    });
  }

  getActionLabel(): string {
    return 'Save';
  }

  delete(): void {
    this.categoryService.deleteCategory(this.accountId, this.currentCategory.id);
    this.app.goBack();
  }
}
