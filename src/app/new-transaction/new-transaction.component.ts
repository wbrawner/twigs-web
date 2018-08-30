import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction'

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  transaction: Transaction;

  constructor() { }

  ngOnInit() {
    this.transaction = new Transaction()
  }

}
