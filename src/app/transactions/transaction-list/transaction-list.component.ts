import { Component, OnInit, Input, Inject } from '@angular/core';
import { Transaction } from '../transaction';
import { TWIGS_SERVICE, TwigsService } from '../../shared/twigs.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  @Input() budgetId: number;
  @Input() categoryId?: number;
  public transactions: Transaction[];

  constructor(
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setDate(1);
    this.twigsService.getTransactions(this.budgetId, this.categoryId, null, date).subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
