import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionDetailsComponent } from './transactions/transaction-details/transaction-details.component';
import { NewTransactionComponent } from './transactions/new-transaction/new-transaction.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailsComponent } from './categories/category-details/category-details.component';
import { NewCategoryComponent } from './categories/new-category/new-category.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewAccountComponent } from './accounts/new-account/new-account.component';
import { AccountDetailsComponent } from './accounts/account-details/account-details.component';

const routes: Routes = [
  { path: '', component: AccountsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'accounts/new', component: NewAccountComponent },
  { path: 'accounts/:id', component: AccountDetailsComponent },
  { path: 'accounts/:accountId/transactions', component: TransactionsComponent },
  { path: 'accounts/:accountId/transactions/new', component: NewTransactionComponent },
  { path: 'accounts/:accountId/transactions/:id', component: TransactionDetailsComponent },
  { path: 'accounts/:accountId/categories', component: CategoriesComponent },
  { path: 'accounts/:accountId/categories/new', component: NewCategoryComponent },
  { path: 'accounts/:accountId/categories/:id', component: CategoryDetailsComponent },
];

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
