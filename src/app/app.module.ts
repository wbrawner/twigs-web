import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, 
  MatDatepickerModule,  
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule,
  MatListModule, 
  MatRadioModule,
  MatProgressBarModule,
  MatToolbarModule, 
} from '@angular/material';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { AddEditTransactionComponent } from './add-edit-transaction/add-edit-transaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    NewTransactionComponent,
    AddEditTransactionComponent,
    DashboardComponent,
    CategoriesComponent,
    CategoryDetailsComponent,
    AddEditCategoryComponent,
    NewCategoryComponent,
    CategoryListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatProgressBarModule,
    MatToolbarModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
