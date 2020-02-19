import { Component, OnInit, Input, Inject } from '@angular/core';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';
import { AppComponent } from '../app.component';
import { Budget } from '../budgets/budget';
import { ActivatedRoute } from '@angular/router';
import { TWIGS_SERVICE, TwigsService } from '../shared/twigs.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  budgetId: number;
  public transactionType = TransactionType;

  public transactions: Transaction[];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.budgetId = Number.parseInt(this.route.snapshot.paramMap.get('budgetId'));
    this.app.backEnabled = true;
    this.app.title = 'Transactions';
    this.getTransactions();
  }

  getTransactions(): void {
    this.twigsService.getTransactions(this.budgetId).subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
