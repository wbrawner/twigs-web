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
  MatToolbarModule, 
} from '@angular/material';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { AddEditTransactionComponent } from './add-edit-transaction/add-edit-transaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    NewTransactionComponent,
    AddEditTransactionComponent,
    DashboardComponent
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
    MatToolbarModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
