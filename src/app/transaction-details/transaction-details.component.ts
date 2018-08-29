import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction' 

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  public transaction: Transaction;

  constructor() { }

  ngOnInit() {
  }

}
