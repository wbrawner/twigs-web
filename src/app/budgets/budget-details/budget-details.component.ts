import { Component, OnInit, Inject } from '@angular/core';
import { Budget } from '../budget';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Transaction } from 'src/app/transactions/transaction';
import { Category } from 'src/app/categories/category';
import { Observable } from 'rxjs';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit {

  budget: Budget;
  public transactions: Transaction[];
  public expenses: Category[] = [];
  public income: Category[] = [];
  categoryBalances: Map<number, number>;
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
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.getBudget();
    this.app.backEnabled = false;
    this.categoryBalances = new Map();
  }

  getBudget() {
    const id = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.twigsService.getBudget(id)
      .subscribe(budget => {
        this.app.title = budget.name;
        this.budget = budget;
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
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(1);
    this.twigsService.getTransactions(this.budget.id, null, 5, date)
      .subscribe(transactions => this.transactions = <Transaction[]>transactions);
  }

  getCategories(): void {
    this.twigsService.getCategories(this.budget.id).subscribe(categories => {
      const categoryBalances = new Map<number, number>();
      let categoryBalancesCount = 0;
      console.log(categories);
      for (const category of categories) {
        if (category.expense) {
          this.expenses.push(category);
          this.expectedExpenses += category.amount;
        } else {
          this.income.push(category);
          this.expectedIncome += category.amount;
        }
        this.getCategoryBalance(category.id).subscribe(
          balance => {
            console.log(balance);
            if (category.expense) {
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

  getCategoryBalance(category: number): Observable<number> {
    return Observable.create(subscriber => {
      let date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setDate(1);  
      this.twigsService.getTransactions(this.budget.id, category, null, date).subscribe(transactions => {
        let balance = 0;
        for (const transaction of transactions) {
          if (transaction.expense) {
            balance -= transaction.amount;
          } else {
            balance += transaction.amount;
          }
        }
        subscriber.next(balance);
        subscriber.complete();
      });
    });
  }
}
