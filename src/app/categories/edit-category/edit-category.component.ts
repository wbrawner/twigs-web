import { Component, OnInit, Inject } from '@angular/core';
import { Category } from '../category';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { TWIGS_SERVICE, TwigsService } from '../../shared/twigs.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  budgetId: number;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit(): void {
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
