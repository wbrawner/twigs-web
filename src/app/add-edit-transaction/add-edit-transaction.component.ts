import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Transaction } from '../transaction'
import { TransactionType } from '../transaction.type'
import { TransactionService } from '../transaction.service'
import { Category } from '../category'
import { CategoryService } from '../category.service'
import { AppComponent } from '../app.component';
import { Actionable } from '../actionable';

@Component({
  selector: 'app-add-edit-transaction',
  templateUrl: './add-edit-transaction.component.html',
  styleUrls: ['./add-edit-transaction.component.css']
})
export class AddEditTransactionComponent implements OnInit, OnDestroy, Actionable {
  @Input() title: string;
  @Input() currentTransaction: Transaction;
  public transactionType = TransactionType;
  public selectedCategory: Category;
  public categories: Category[];

  constructor(
    private app: AppComponent,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
  ) { }

  ngOnInit() {
    this.app.title = this.title;
    this.app.backEnabled = true;
    this.app.actionable = this;
    this.getCategories();
  }

  ngOnDestroy() {
    this.app.actionable = null;
  }

  doAction(): void {
    if (this.currentTransaction.id) {
      // This is an existing transaction, update it
      this.transactionService.updateTransaction(this.currentTransaction);
    } else {
      // This is a new transaction, save it
      this.transactionService.saveTransaction(this.currentTransaction);
    }
    this.app.goBack();
  }

  getActionLabel(): string {
    return 'Save';
  }

  delete(): void {
    this.transactionService.deleteTransaction(this.currentTransaction);
    this.app.goBack();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }
}
