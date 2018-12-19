import { Component, OnInit, Input, OnChanges, OnDestroy, Inject } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionType } from '../transaction.type';
import { TransactionService, TRANSACTION_SERVICE } from '../transaction.service';
import { Category } from '../category';
import { AppComponent } from '../app.component';
import { Actionable } from '../actionable';
import { CATEGORY_SERVICE, CategoryService } from '../category.service';

@Component({
  selector: 'app-add-edit-transaction',
  templateUrl: './add-edit-transaction.component.html',
  styleUrls: ['./add-edit-transaction.component.css']
})
export class AddEditTransactionComponent implements OnInit, OnDestroy, Actionable {
  @Input() title: string;
  @Input() currentTransaction: Transaction;
  @Input() group: string;
  public transactionType = TransactionType;
  public selectedCategory: Category;
  public categories: Category[];
  public rawAmount: string;

  constructor(
    private app: AppComponent,
    @Inject(CATEGORY_SERVICE) private categoryService: CategoryService,
    @Inject(TRANSACTION_SERVICE) private transactionService: TransactionService,
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
    // The amount will be input as a decimal value so we need to convert it
    // to an integer
    this.currentTransaction.amount *= 100;
    let observable;
    if (this.currentTransaction.id) {
      // This is an existing transaction, update it
      observable = this.transactionService.updateTransaction(this.currentTransaction.id, this.currentTransaction);
    } else {
      // This is a new transaction, save it
      observable = this.transactionService.createTransaction(
        this.currentTransaction.title,
        this.currentTransaction.description,
        this.currentTransaction.amount,
        this.currentTransaction.date,
        this.currentTransaction.type === TransactionType.EXPENSE,
        this.currentTransaction.categoryId,
      );
    }

    observable.subscribe(val => {
      this.app.goBack();
    });
  }

  getActionLabel(): string {
    return 'Save';
  }

  delete(): void {
    this.transactionService.deleteTransaction(this.currentTransaction.id);
    this.app.goBack();
  }

  getCategories() {
    this.categoryService.getCategories(this.app.group).subscribe(categories => this.categories = categories);
  }
}
