import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { Category } from '../category';
import { AppComponent } from 'src/app/app.component';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit {

  @Input() budgetId: number;
  @Input() title: string;
  @Input() currentCategory: Category;

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = true;
    this.app.title = this.title;
  }

  save(): void {
    let observable;
    if (this.currentCategory.id) {
      // This is an existing category, update it
      observable = this.twigsService.updateCategory(
        this.budgetId,
        this.currentCategory.id,
        {
          name: this.currentCategory.title,
          amount: this.currentCategory.amount * 100,
          expense: this.currentCategory.expense,
          archived: this.currentCategory.archived
        }
      );
    } else {
      // This is a new category, save it
      observable = this.twigsService.createCategory(
        this.budgetId,
        this.currentCategory.title,
        this.currentCategory.amount * 100,
        this.currentCategory.expense
      );
    }
    observable.subscribe(val => {
      this.app.goBack();
    });
  }

  delete(): void {
    this.twigsService.deleteCategory(this.budgetId, this.currentCategory.id).subscribe(() => {
      this.app.goBack();
    });
  }
}
