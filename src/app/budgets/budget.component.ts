import { Component, OnInit, Input, Inject, ChangeDetectorRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { Budget } from './budget';
import { TWIGS_SERVICE, TwigsService } from '../shared/twigs.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetsComponent implements OnInit {

  @Input() budgetId: string;
  public budgets: Budget[];

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = this.isLoggedIn();
    this.app.title = 'Budgets';
    this.twigsService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
    });
  }

  isLoggedIn(): boolean {
    return this.app.isLoggedIn();
  }
}
