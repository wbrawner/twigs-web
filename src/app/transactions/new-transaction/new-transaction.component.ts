import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  accountId: string;
  transaction: Transaction;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.transaction = new Transaction();
  }

}
