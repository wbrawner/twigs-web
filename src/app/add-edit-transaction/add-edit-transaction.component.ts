import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '../transaction' 
import { TransactionType } from '../transaction.type'
import { TransactionService } from '../transaction.service'
import { Location } from '@angular/common';
import { Category } from '../category' 
import { CategoryService } from '../category.service'

@Component({
  selector: 'app-add-edit-transaction',
  templateUrl: './add-edit-transaction.component.html',
  styleUrls: ['./add-edit-transaction.component.css']
})
export class AddEditTransactionComponent implements OnInit {

  @Input() title: string;
  @Input() currentTransaction: Transaction;
  public transactionType = TransactionType;
  public selectedCategory: Category;
  public categories: Category[]

  constructor(
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCategories()
  }

  goBack(): void {
    this.location.back()
  }

  save(): void {
    if (this.currentTransaction.id) {
      // This is an existing transaction, update it
      this.transactionService.updateTransaction(this.currentTransaction);
    } else {
      // This is a new transaction, save it
      this.transactionService.saveTransaction(this.currentTransaction);
    }
    this.goBack()
  }

  delete(): void {
    this.transactionService.deleteTransaction(this.currentTransaction);
    this.goBack()
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories)
  }
}
