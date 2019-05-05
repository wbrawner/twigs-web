import { Component, OnInit, Input, Inject } from '@angular/core';
import { Transaction } from './transaction';
import { TransactionType } from './transaction.type';
import { TransactionService, TRANSACTION_SERVICE } from './transaction.service';
import { AppComponent } from '../app.component';
import { Account } from '../accounts/account';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  accountId: string;
  public transactionType = TransactionType;

  public transactions: Transaction[];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.app.backEnabled = true;
    this.app.title = 'Transactions';
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions(this.accountId).subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
