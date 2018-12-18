import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction'
import { TransactionService } from '../transaction.service'
import { CategoryService } from '../category.service'
import { Category } from '../category'
import { AppComponent } from '../app.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public balance: number;
  public transactions: Transaction[];
  public categories: Category[];
  categoryBalances: Map<number, number>;

  constructor(
    private app: AppComponent,
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.app.backEnabled = false;
    this.app.title = 'My Finances';
    this.balance = 0;
    this.getBalance();
    this.getTransactions();
    this.getCategories();
    this.categoryBalances = new Map();
  }

  getBalance(): void {
    this.transactionService.getBalance().subscribe(balance => this.balance = balance)
  }

  getTransactions(): void {
    this.transactionService.getTransactions(5).subscribe(transactions => this.transactions = <Transaction[]> transactions);
  }

  getCategories(): void {
    this.categoryService.getCategories(5).subscribe(categories => {
      this.categories = categories;
      for (const category of this.categories) {
        this.categoryService.getBalance(category).subscribe(balance => this.categoryBalances.set(category.id,  balance))
      }
    });
  }
}
