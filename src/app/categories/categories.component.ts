import { Component, OnInit, Inject } from '@angular/core';
import { Category } from './category';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { TWIGS_SERVICE, TwigsService } from '../shared/twigs.service';
import { Transaction } from '../transactions/transaction';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  budgetId: string;
  public categories: Category[];
  public categoryBalances: Map<string, number>;

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.budgetId = this.route.snapshot.paramMap.get('budgetId');
    this.app.setTitle('Categories')
    this.app.setBackEnabled(true);
    this.getCategories();
    this.categoryBalances = new Map();
  }

  getCategories(): void {
    this.twigsService.getCategories(this.budgetId).then(categories => {
      this.categories = categories;
      for (const category of this.categories) {
        this.getCategoryBalance(category).then(balance => this.categoryBalances.set(category.id, balance));
      }
    });
  }

  getCategoryBalance(category: Category): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let transactions: Transaction[]
      try {
        transactions = await this.twigsService.getTransactions(this.budgetId, category.id)
      } catch(e) {
        reject(e)
      }
      let balance = 0;
      for (const transaction of transactions) {
        if (transaction.expense) {
          balance -= transaction.amount;
        } else {
          balance += transaction.amount;
        }
      }
      resolve(balance);
    });
  }
}
