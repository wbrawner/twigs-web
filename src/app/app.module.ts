import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { BudgetsComponent } from './budgets/budget.component';
import { TransactionDetailsComponent } from './transactions/transaction-details/transaction-details.component';
import { NewTransactionComponent } from './transactions/new-transaction/new-transaction.component';
import { AddEditTransactionComponent } from './transactions/add-edit-transaction/add-edit-transaction.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailsComponent } from './categories/category-details/category-details.component';
import { CategoryFormComponent } from './categories/category-form/category-form.component';
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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CategoryBreakdownComponent } from './categories/category-breakdown/category-breakdown.component';
import { NgChartsModule } from 'ng2-charts';
import { TWIGS_SERVICE } from './shared/twigs.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { TwigsHttpService } from './shared/twigs.http.service';
import { TwigsLocalService } from './shared/twigs.local.service';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list.component';
import { EditCategoryComponent } from './categories/edit-category/edit-category.component';
import { EditBudgetComponent } from './budgets/edit-budget/edit-budget.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    NewTransactionComponent,
    AddEditTransactionComponent,
    CategoriesComponent,
    CategoryDetailsComponent,
    CategoryFormComponent,
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
    TransactionListComponent,
    EditCategoryComponent,
    EditBudgetComponent,
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
    MatProgressSpinnerModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    NgChartsModule,
    MatCheckboxModule,
    MatCardModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: TWIGS_SERVICE, useClass: TwigsHttpService },
    { provide: Storage, useValue: window.localStorage },
    // { provide: TWIGS_SERVICE, useClass: TwigsLocalService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
