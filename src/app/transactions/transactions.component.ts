import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionType } from '../transaction.type';
import { TransactionService } from '../transaction.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  public transactionType = TransactionType;

  public transactions: Transaction[]

  constructor(
    private app: AppComponent,
    private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = true;
    this.app.title = 'Transactions';
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
