import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';

const routes: Routes = [
  { path: '', redirectTo: '/transactions', pathMatch: 'full' },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transactions/new', component: NewTransactionComponent },
  { path: 'transactions/:id', component: TransactionDetailsComponent },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
