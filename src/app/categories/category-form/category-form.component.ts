import { Component, OnInit, Input, Inject } from '@angular/core';
import { Category } from '../category';
import { AppComponent } from 'src/app/app.component';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';
import { decimalToInteger } from 'src/app/shared/utils';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  @Input() budgetId: string;
  @Input() title: string;
  @Input() currentCategory: Category;
  @Input() create: boolean;

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.app.setBackEnabled(true);
    this.app.setTitle(this.title)
  }

  save(): void {
    let promise;
    this.currentCategory.amount = decimalToInteger(String(this.currentCategory.amount))
    if (this.create) {
      // This is a new category, save it
      promise = this.twigsService.createCategory(
        this.currentCategory.id,
        this.budgetId,
        this.currentCategory.title,
        this.currentCategory.description,
        this.currentCategory.amount,
        this.currentCategory.expense
      );
    } else {
      // This is an existing category, update it
      const updatedCategory: Category = {
        ...this.currentCategory,
      }
      promise = this.twigsService.updateCategory(
        this.currentCategory.id,
        this.currentCategory
      );
    }
    promise.then(_ => {
      this.app.goBack();
    });
  }

  delete(): void {
    this.twigsService.deleteCategory(this.currentCategory.id).then(() => {
      this.app.goBack();
    });
  }
}
