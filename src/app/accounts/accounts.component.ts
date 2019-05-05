import { Component, OnInit, Input, Inject } from '@angular/core';
import { AppComponent } from '../app.component';
import { ACCOUNT_SERVICE, AccountService } from './account.service';
import { Account } from './account';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  @Input() accountId: string;
  public accounts: Account[];

  constructor(
    private app: AppComponent,
    @Inject(ACCOUNT_SERVICE) private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.app.backEnabled = true;
    this.app.title = 'Accounts';
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  isLoggedIn(): boolean {
    return this.app.isLoggedIn();
  }
}
