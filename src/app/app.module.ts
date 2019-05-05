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
import { AccountsComponent } from './accounts/accounts.component';
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
import { AddEditAccountComponent } from './accounts/add-edit-account/add-edit-account.component';
import { EditProfileComponent } from './users/edit-profile/edit-profile.component';
import { UserComponent } from './users/user.component';
import { NewAccountComponent } from './accounts/new-account/new-account.component';
import { AccountDetailsComponent } from './accounts/account-details/account-details.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { TRANSACTION_SERVICE } from './transactions/transaction.service';
import { TransactionServiceFirebaseFirestoreImpl } from './transactions/transaction.service.firestore';
import { CATEGORY_SERVICE } from './categories/category.service';
import { CategoryServiceFirebaseFirestoreImpl } from './categories/category.service.firestore';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ACCOUNT_SERVICE } from './accounts/account.service';
import { FirestoreAccountService } from './accounts/account.service.firestore';
import { USER_SERVICE } from './users/user.service';
import { FirestoreUserService } from './users/user.service.firestore';

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
    AddEditAccountComponent,
    EditProfileComponent,
    UserComponent,
    NewAccountComponent,
    AccountDetailsComponent,
    AccountsComponent,
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
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: TRANSACTION_SERVICE, useClass: TransactionServiceFirebaseFirestoreImpl },
    { provide: CATEGORY_SERVICE, useClass: CategoryServiceFirebaseFirestoreImpl },
    { provide: ACCOUNT_SERVICE, useClass: FirestoreAccountService },
    { provide: USER_SERVICE, useClass: FirestoreUserService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
