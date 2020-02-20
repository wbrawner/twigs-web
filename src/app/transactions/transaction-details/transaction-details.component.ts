import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../transaction';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  budgetId: number;
  transaction: Transaction;

  constructor(
    private route: ActivatedRoute,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.getTransaction();
  }

  getTransaction(): void {
    const id = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.twigsService.getTransaction(id)
      .subscribe(transaction => {
        transaction.amount /= 100;
        this.transaction = transaction;
        this.budgetId = transaction.budgetId;
      });
  }
}
