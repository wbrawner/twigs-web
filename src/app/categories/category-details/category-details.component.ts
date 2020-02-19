import { Component, OnInit, Inject } from '@angular/core';
import { Category } from '../category';
import { ActivatedRoute } from '@angular/router';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {

  budgetId: number;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.getCategory();
  }

  getCategory(): void {
    const id = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.twigsService.getCategory(id)
      .subscribe(category => {
        category.amount /= 100;
        this.category = category;
      });
  }
}
