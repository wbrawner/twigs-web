import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Budget } from '../budget';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Transaction } from 'src/app/transactions/transaction';
import { Category } from 'src/app/categories/category';
import { ChartDataset } from 'chart.js';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';
import { Actionable } from '../../shared/actionable';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit, OnDestroy, Actionable {
  budget: Budget;
  public budgetBalance: number;
  public transactions: Transaction[];
  public expenses: Category[] = [];
  public income: Category[] = [];
  categoryBalances: Map<string, number>;
  expectedIncome = 0;
  actualIncome = 0;
  expectedExpenses = 0;
  actualExpenses = 0;
  barChartLabels: string[] = ['Income', 'Expenses'];
  barChartData: ChartDataset[] = [
    { data: [0, 0], label: 'Expected' },
    { data: [0, 0], label: 'Actual' },
  ];
  from: Date
  to: Date

  constructor(
    private app: AppComponent,
    private route: ActivatedRoute,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private router: Router,
  ) {
    let fromStr = this.route.snapshot.queryParamMap.get('from');
    if (fromStr) {
      let fromDate = new Date(fromStr);
      if (!isNaN(fromDate.getTime())) {
        this.from = fromDate;
      }
    }

    if (!this.from) {
      let date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setDate(1);
      this.from = date;
    }

    let toStr = this.route.snapshot.queryParamMap.get('to');
    if (toStr) {
      let toDate = new Date(toStr);
      if (!isNaN(toDate.getTime())) {
        this.to = toDate;
      }
    }
  }

  ngOnInit() {
    this.getBudget();
    this.app.setBackEnabled(false);
    this.app.setActionable(this)
    this.categoryBalances = new Map();
  }

  ngOnDestroy() {
    this.app.setActionable(null)
  }

  getBudget() {
    const id = this.route.snapshot.paramMap.get('id');
    this.twigsService.getBudget(id)
      .then(budget => {
        this.app.setTitle(budget.name)
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

  getBalance(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.twigsService.getBudgetBalance(id, this.from, this.to)
      .then(balance => {
        this.budgetBalance = balance;
      });
  }

  getTransactions(): void {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setDate(1);
    this.twigsService.getTransactions(this.budget.id, null, 5, date)
      .subscribe(transactions => this.transactions = <Transaction[]>transactions);
  }

  async getCategories() {
    const categories = await this.twigsService.getCategories(this.budget.id)
    const categoryBalances = new Map<string, number>();
    let categoryBalancesCount = 0;
    for (const category of categories) {
      if (category.expense) {
        this.expenses.push(category);
        this.expectedExpenses += category.amount;
      } else {
        this.income.push(category);
        this.expectedIncome += category.amount;
      }
      try {
        const balance = await this.twigsService.getCategoryBalance(category.id, this.from, this.to)
        console.log(balance);
        if (category.expense) {
          this.actualExpenses += balance * -1;
        } else {
          this.actualIncome += balance;
        }
        categoryBalances.set(category.id, balance);
        if (categoryBalancesCount === categories.length - 1) {
          // This weird workaround is to force the OnChanges callback to be fired.
          // Angular needs the reference to the object to change in order for it to
          // work.
          this.categoryBalances = categoryBalances;
          this.updateBarChart();
        }
      } finally {
        categoryBalancesCount++;
      }
    }
  }

  doAction(): void {
    this.router.navigateByUrl(this.router.routerState.snapshot.url + "/edit")
  }

  getActionLabel(): string {
    return "Edit";
  }
}
