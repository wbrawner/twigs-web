import { Component, OnInit } from '@angular/core';
import { Category } from '../category'

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  category: Category;

  constructor() { }

  ngOnInit() {
    this.category = new Category();
    // TODO: Set random color for category, improve color picker
    //this.category.color = 
  }

}
