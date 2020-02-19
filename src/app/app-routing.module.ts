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
import { BudgetsComponent } from './budgets/budget.component';
import { NewBudgetComponent } from './budgets/new-budget/new-budget.component';
import { BudgetDetailsComponent } from './budgets/budget-details/budget-details.component';

const routes: Routes = [
  { path: '', component: BudgetsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'budgets/new', component: NewBudgetComponent },
  { path: 'budgets/:id', component: BudgetDetailsComponent },
  { path: 'budgets/:budgetId/transactions', component: TransactionsComponent },
  { path: 'budgets/:budgetId/transactions/new', component: NewTransactionComponent },
  { path: 'budgets/:budgetId/transactions/:id', component: TransactionDetailsComponent },
  { path: 'budgets/:budgetId/categories', component: CategoriesComponent },
  { path: 'budgets/:budgetId/categories/new', component: NewCategoryComponent },
  { path: 'budgets/:budgetId/categories/:id', component: CategoryDetailsComponent },
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
