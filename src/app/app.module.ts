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
  MatSelectModule,
  MatToolbarModule,
  MatSidenavModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { BudgetsComponent } from './budgets/budget.component';
import { TransactionDetailsComponent } from './transactions/transaction-details/transaction-details.component';
import { NewTransactionComponent } from './transactions/new-transaction/new-transaction.component';
import { AddEditTransactionComponent } from './transactions/add-edit-transaction/add-edit-transaction.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailsComponent } from './categories/category-details/category-details.component';
import { AddEditCategoryComponent } from './categories/add-edit-category/add-edit-category.component';
import { NewCategoryComponent } from './categories/new-category/new-category.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { AddEditBudgetComponent } from './budgets/add-edit-budget/add-edit-budget.component';
import { EditProfileComponent } from './users/edit-profile/edit-profile.component';
import { UserComponent } from './users/user.component';
import { NewBudgetComponent } from './budgets/new-budget/new-budget.component';
import { BudgetDetailsComponent } from './budgets/budget-details/budget-details.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CategoryBreakdownComponent } from './categories/category-breakdown/category-breakdown.component';
import { ChartsModule } from 'ng2-charts';
import { TWIGS_SERVICE } from './shared/twigs.service';
import { TwigsHttpService } from './shared/twigs.http.service';
import { TwigsLocalService } from './shared/twigs.local.service';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  precision: 2,
  prefix: '',
  thousands: ',',
  decimal: '.',
  suffix: '',
  allowNegative: false,
};

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    NewTransactionComponent,
    AddEditTransactionComponent,
    CategoriesComponent,
    CategoryDetailsComponent,
    AddEditCategoryComponent,
    NewCategoryComponent,
    CategoryListComponent,
    LoginComponent,
    RegisterComponent,
    AddEditBudgetComponent,
    EditProfileComponent,
    UserComponent,
    NewBudgetComponent,
    BudgetDetailsComponent,
    BudgetsComponent,
    CategoryBreakdownComponent,
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
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    CurrencyMaskModule,
    ChartsModule,
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: TWIGS_SERVICE, useClass: TwigsHttpService },
    // { provide: TWIGS_SERVICE, useClass: TwigsLocalService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
