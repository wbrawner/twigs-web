import { Component, OnInit, Input, Inject } from '@angular/core';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';
import { TransactionService, TRANSACTION_SERVICE } from './transaction.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input() group: string;
  public transactionType = TransactionType;

  public transactions: Transaction[];

  constructor(
    private app: AppComponent,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = true;
    this.app.title = 'Transactions';
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions(this.app.group).subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
