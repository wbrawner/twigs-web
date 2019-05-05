import { Component, OnInit, Input, Inject } from '@angular/core';
import { TransactionService, TRANSACTION_SERVICE } from '../transaction.service';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../transaction';
import { Account } from 'src/app/accounts/account';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  accountId: string;
  transaction: Transaction;

  constructor(
    private route: ActivatedRoute,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.getTransaction();
  }

  getTransaction(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    const id = this.route.snapshot.paramMap.get('id');
    this.transactionService.getTransaction(this.accountId, id)
      .subscribe(transaction => {
        transaction.amount /= 100;
        this.transaction = transaction;
      });
  }
}
