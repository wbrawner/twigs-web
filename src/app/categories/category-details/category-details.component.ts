import { Component, OnInit, Inject, ApplicationModule } from '@angular/core';
import { Category } from '../category';
import { ActivatedRoute } from '@angular/router';
import { TWIGS_SERVICE, TwigsService } from '../../shared/twigs.service';
import { Transaction } from '../../transactions/transaction';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  budgetId: number;
  category: Category;
  public transactions: Transaction[];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = true;
    this.getCategory();
  }

  getCategory(): void {
    const id = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.twigsService.getCategory(id)
      .subscribe(category => {
        category.amount /= 100;
        this.app.title = category.title;
        this.category = category;
        this.budgetId = category.budgetId;
      });
  }
}
