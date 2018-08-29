import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service'
import { Transaction } from '../transaction'
import { TransactionType } from '../transaction.type'
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  public transaction = new Transaction()
  public transactionType = TransactionType;

  constructor(
    private transactionService: TransactionService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.transactionService.saveTransaction(this.transaction);
    this.location.back()
  }
}
