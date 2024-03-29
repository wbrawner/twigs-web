import { Component, OnInit, Input, OnChanges, OnDestroy, Inject, SimpleChanges } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionType } from '../transaction.type';
import { Category } from 'src/app/categories/category';
import { AppComponent } from 'src/app/app.component';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { decimalToInteger } from 'src/app/shared/utils';

@Component({
  selector: 'app-add-edit-transaction',
  templateUrl: './add-edit-transaction.component.html',
  styleUrls: ['./add-edit-transaction.component.css']
})
export class AddEditTransactionComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() currentTransaction: Transaction;
  @Input() budgetId: string;
  @Input() create: boolean
  public transactionType = TransactionType;
  public categories: Category[];
  public currentTime: string;
  public transactionDate: string;

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
  ) { }

  ngOnInit() {
    this.app.setTitle(this.title)
    this.app.setBackEnabled(true);
    let d: Date, expense: boolean;
    if (this.currentTransaction) {
      d = new Date(this.currentTransaction.date);
      expense = this.currentTransaction.expense;
    } else {
      d = new Date();
      expense = true;
    }
    this.updateCategories(new MatRadioChange(undefined, expense));
    this.transactionDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    this.currentTime = d.toTimeString().slice(0, 5);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.currentTransaction) {
      return;
    }

    const d = new Date(changes.currentTransaction.currentValue.date * 1000);
    this.transactionDate = d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
    this.currentTime = d.toLocaleTimeString(undefined, { hour: '2-digit', hour12: false, minute: '2-digit' });
  }

  updateCategories(change: MatRadioChange) {
    this.twigsService.getCategories(this.budgetId)
      .then(newCategories => {
        this.categories = newCategories.filter(category => category.expense === change.value)
      })
  }

  save(): void {
    let promise;
    this.currentTransaction.amount = decimalToInteger(String(this.currentTransaction.amount))
    this.currentTransaction.date = new Date();
    const dateParts = this.transactionDate.split('-');
    this.currentTransaction.date.setFullYear(parseInt(dateParts[0], 10));
    this.currentTransaction.date.setMonth(parseInt(dateParts[1], 10) - 1);
    this.currentTransaction.date.setDate(parseInt(dateParts[2], 10));
    const timeParts = this.currentTime.split(':');
    this.currentTransaction.date.setHours(parseInt(timeParts[0], 10));
    this.currentTransaction.date.setMinutes(parseInt(timeParts[1], 10));
    if (this.create) {
      // This is a new transaction, save it
      promise = this.twigsService.createTransaction(
        this.currentTransaction.id,
        this.budgetId,
        this.currentTransaction.title,
        this.currentTransaction.description,
        this.currentTransaction.amount,
        this.currentTransaction.date,
        this.currentTransaction.expense,
        this.currentTransaction.categoryId,
      );
    } else {
      // This is an existing transaction, update it
      const updatedTransaction: Transaction = {
        ...this.currentTransaction,
      }
      promise = this.twigsService.updateTransaction(
        this.currentTransaction.id,
        updatedTransaction
      );
    }

    promise.then(() => {
      this.app.goBack();
    });
  }

  delete(): void {
    this.twigsService.deleteTransaction(this.currentTransaction.id).then(() => {
      this.app.goBack();
    });
  }
}
