import { Component, OnInit, Input, Inject } from '@angular/core';
import { CategoryService, CATEGORY_SERVICE } from './category.service';
import { Category } from './category';
import { AppComponent } from '../app.component';
import { TransactionService, TRANSACTION_SERVICE } from '../transactions/transaction.service';
import { Observable } from 'rxjs';
import { TransactionType } from '../transactions/transaction.type';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input() group: string;
  public categories: Category[];
  public categoryBalances: Map<string, number>;

  constructor(
    private app: AppComponent,
    @Inject(CATEGORY_SERVICE) private categoryService: CategoryService,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.app.title = 'Categories';
    this.app.backEnabled = true;
    this.getCategories();
    this.categoryBalances = new Map();
  }

  getCategories(): void {
    this.categoryService.getCategories(this.app.group).subscribe(categories => {
      this.categories = categories;
      for (const category of this.categories) {
        this.getCategoryBalance(category.id).subscribe(balance => this.categoryBalances.set(category.id, balance));
      }
    });
  }

  getCategoryBalance(category: string): Observable<number> {
    return Observable.create(subscriber => {
      this.transactionService.getTransactionsForCategory(category).subscribe(transactions => {
        let balance = 0;
        for (const transaction of transactions) {
          if (transaction.type === TransactionType.INCOME) {
            balance += transaction.amount;
          } else {
            balance -= transaction.amount;
          }
        }
        subscriber.next(balance);
      });
    });
  }
}
