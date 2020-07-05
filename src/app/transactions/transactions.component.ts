import { Component, OnInit, Input, Inject } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  budgetId: number;
  categoryId?: number;

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
  ) { }

  ngOnInit() {
    this.budgetId = Number.parseInt(this.route.snapshot.paramMap.get('budgetId'));
    this.categoryId = Number.parseInt(this.route.snapshot.queryParamMap.get('categoryId'));
    this.app.backEnabled = true;
    this.app.title = 'Transactions';
  }
}
