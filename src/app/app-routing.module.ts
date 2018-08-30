import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { NewCategoryComponent } from './new-category/new-category.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transactions/new', component: NewTransactionComponent },
  { path: 'transactions/:id', component: TransactionDetailsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/new', component: NewCategoryComponent },
  { path: 'categories/:id', component: CategoryDetailsComponent },
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
