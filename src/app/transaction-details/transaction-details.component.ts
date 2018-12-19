import { Component, OnInit, Input, Inject } from '@angular/core';
import { TransactionService, TRANSACTION_SERVICE } from '../transaction.service';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  transaction: Transaction;

  constructor(
    private route: ActivatedRoute,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.getTransaction();
  }

  getTransaction(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.transactionService.getTransaction(id)
      .subscribe(transaction => {
        transaction.amount /= 100;
        this.transaction = transaction;
      });
  }
}
