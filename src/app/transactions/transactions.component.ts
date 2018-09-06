import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionType } from '../transaction.type';
import { TransactionService } from '../transaction.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  public transactionType = TransactionType;

  public transactions: Transaction[]

  constructor(
    private transactionService: TransactionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getTransactions()
  }

  goBack(): void {
    this.location.back()
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    })
  }
}
