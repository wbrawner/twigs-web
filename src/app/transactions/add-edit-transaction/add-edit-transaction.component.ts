import { Component, OnInit, Input, OnChanges, OnDestroy, Inject } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionType } from '../transaction.type';
import { TransactionService, TRANSACTION_SERVICE } from '../transaction.service';
import { Category } from 'src/app/categories/category';
import { Actionable } from 'src/app/actionable';
import { AppComponent } from 'src/app/app.component';
import { CATEGORY_SERVICE, CategoryService } from 'src/app/categories/category.service';
import { Account } from 'src/app/accounts/account';

@Component({
  selector: 'app-add-edit-transaction',
  templateUrl: './add-edit-transaction.component.html',
  styleUrls: ['./add-edit-transaction.component.css']
})
export class AddEditTransactionComponent implements OnInit, OnDestroy, Actionable {
  @Input() title: string;
  @Input() currentTransaction: Transaction;
  @Input() accountId: string;
  public transactionType = TransactionType;
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
    let observable;
    if (this.currentTransaction.id) {
      // This is an existing transaction, update it
      observable = this.transactionService.updateTransaction(
        this.accountId,
        this.currentTransaction.id,
        {
          name: this.currentTransaction.title,
          description: this.currentTransaction.description,
          amount: this.currentTransaction.amount * 100,
          date: this.currentTransaction.date,
          category: this.currentTransaction.categoryId,
          isExpense: this.currentTransaction.type === TransactionType.EXPENSE
        }
      );
    } else {
      // This is a new transaction, save it
      observable = this.transactionService.createTransaction(
        this.accountId,
        this.currentTransaction.title,
        this.currentTransaction.description,
        this.currentTransaction.amount * 100,
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
    this.transactionService.deleteTransaction(this.accountId, this.currentTransaction.id).subscribe(() => {
      this.app.goBack();
    });
  }

  getCategories() {
    this.categoryService.getCategories(this.accountId).subscribe(categories => this.categories = categories);
  }
}
