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
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';

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
  expectedIncome = 0;
  actualIncome = 0;
  expectedExpenses = 0;
  actualExpenses = 0;
  barChartLabels: Label[] = ['Income', 'Expenses'];
  barChartData: ChartDataSets[] = [
    { data: [0, 0], label: 'Expected' },
    { data: [0, 0], label: 'Actual' },
  ];

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

  updateBarChart() {
    const color = [0, 188, 212];
    this.barChartData = [
      {
        data: [this.expectedIncome / 100, this.expectedExpenses / 100],
        label: 'Expected',
        backgroundColor: 'rgba(241, 241, 241, 0.8)',
        borderColor: 'rgba(241, 241, 241, 0.9)',
        hoverBackgroundColor: 'rgba(241, 241, 241, 1)',
        hoverBorderColor: 'rgba(241, 241, 241, 1)',
      },
      {
        data: [this.actualIncome / 100, this.actualExpenses / 100],
        label: 'Actual',
        backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
        borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`,
        hoverBackgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
        hoverBorderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
      }
    ];
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
      const categoryBalances = new Map<string, number>();
      let categoryBalancesCount = 0;
      for (const category of categories) {
        if (category.isExpense) {
          this.expenses.push(category);
          this.expectedExpenses += category.amount;
        } else {
          this.income.push(category);
          this.expectedIncome += category.amount;
        }
        this.getCategoryBalance(category.id).subscribe(
          balance => {
            console.log(balance);
            if (category.isExpense) {
              this.actualExpenses += balance * -1;
            } else {
              this.actualIncome += balance;
            }
            categoryBalances.set(category.id, balance);
            categoryBalancesCount++;
          },
          error => { categoryBalancesCount++; },
          () => {
            // This weird workaround is to force the OnChanges callback to be fired.
            // Angular needs the reference to the object to change in order for it to
            // work.
            if (categoryBalancesCount === categories.length) {
              this.categoryBalances = categoryBalances;
              this.updateBarChart();
            }
          }
        );
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
        subscriber.complete();
      });
    });
  }
}
