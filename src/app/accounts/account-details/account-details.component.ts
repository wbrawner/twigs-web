import { Component, OnInit, Inject } from '@angular/core';
import { Account } from '../account';
import { ACCOUNT_SERVICE, AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Transaction } from 'src/app/transactions/transaction';
import { Category } from 'src/app/categories/category';
import { Observable } from 'rxjs';
import { TransactionType } from 'src/app/transactions/transaction.type';
import { TRANSACTION_SERVICE, TransactionService } from 'src/app/transactions/transaction.service';
import { CATEGORY_SERVICE, CategoryService } from 'src/app/categories/category.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  account: Account;
  public transactions: Transaction[];
  public expenses: Category[] = [];
  public income: Category[] = [];
  categoryBalances: Map<string, number>;

  constructor(
    private app: AppComponent,
    private route: ActivatedRoute,
    @Inject(ACCOUNT_SERVICE) private accountService: AccountService,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
    @Inject(CATEGORY_SERVICE) private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.getAccount();
    this.app.backEnabled = false;
    this.categoryBalances = new Map();
  }

  getAccount() {
    const id = this.route.snapshot.paramMap.get('id');
    this.accountService.getAccount(id)
      .subscribe(account => {
        this.app.title = account.name;
        this.account = account;
        this.getBalance();
        this.getTransactions();
        this.getCategories();
      });
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
    this.transactionService.getTransactions(this.account.id, null, 5)
      .subscribe(transactions => this.transactions = <Transaction[]>transactions);
  }

  getCategories(): void {
    this.categoryService.getCategories(this.account.id).subscribe(categories => {
      for (const category of categories) {
        if (category.isExpense) {
          this.expenses.push(category);
        } else {
          this.income.push(category);
        }
        this.getCategoryBalance(category.id).subscribe(balance => this.categoryBalances.set(category.id, balance));
      }
    });
  }

  getCategoryBalance(category: string): Observable<number> {
    return Observable.create(subscriber => {
      this.transactionService.getTransactions(this.account.id, category).subscribe(transactions => {
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
