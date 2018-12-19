import { Component, OnInit, Inject } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionService, TRANSACTION_SERVICE } from '../transaction.service';
import { Category } from '../category';
import { AppComponent } from '../app.component';
import { TransactionType } from '../transaction.type';
import { Observable } from 'rxjs';
import { CategoryService, CATEGORY_SERVICE } from '../category.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public transactions: Transaction[];
  public categories: Category[];
  categoryBalances: Map<string, number>;

  constructor(
    private app: AppComponent,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
    @Inject(CATEGORY_SERVICE) private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = false;
    this.app.title = 'My Finances';
    this.getBalance();
    this.getTransactions();
    this.getCategories();
    this.categoryBalances = new Map();
  }

  getBalance(): number {
    let totalBalance = 0;
    if (!this.categoryBalances) {
      return 0;
    }
    this.categoryBalances.forEach(balance => {
      totalBalance += balance;
    });
    return totalBalance;
  }

  getTransactions(): void {
    this.transactionService.getTransactions(this.app.group, 5).subscribe(transactions => this.transactions = <Transaction[]>transactions);
  }

  getCategories(): void {
    this.categoryService.getCategories(this.app.group, 5).subscribe(categories => {
      this.categories = categories;
      for (const category of categories) {
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
