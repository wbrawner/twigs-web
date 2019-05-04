import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { Account } from '../account';
import { ACCOUNT_SERVICE, AccountService } from '../account.service';
import { AppComponent } from 'src/app/app.component';
import { Actionable } from 'src/app/actionable';
import { UserService, USER_SERVICE } from 'src/app/users/user.service';
import { User } from 'src/app/users/user';

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.css']
})
export class AddEditAccountComponent implements OnInit, OnDestroy, Actionable {
  @Input() title: string;
  @Input() account: Account;
  public users: User[];
  public searchedUsers: User[];

  constructor(
    private app: AppComponent,
    @Inject(ACCOUNT_SERVICE) private accountService: AccountService,
    @Inject(USER_SERVICE) private userService: UserService,
  ) {
    this.app.title = this.title;
    this.app.backEnabled = true;
    this.app.actionable = this;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.app.actionable = null;
  }

  doAction(): void {
    let observable;
    if (this.account.id) {
      // This is an existing transaction, update it
      observable = this.accountService.updateAccount(this.account.id, this.account);
    } else {
      // This is a new transaction, save it
      observable = this.accountService.createAccount(
        this.account.name,
        this.account.description,
        this.account.currency,
        this.users
      );
    }
    // TODO: Check if it was actually successful or not
    observable.subscribe(val => {
      this.app.goBack();
    });
  }

  getActionLabel(): string {
    return 'Save';
  }

  delete(): void {
    this.accountService.deleteAccount(this.account.id);
    this.app.goBack();
  }

  searchUsers(username: string) {
    this.userService.getUsersByUsername(username).subscribe(users => {
      this.searchedUsers = users;
    });
  }

  clearUserSearch() {
    this.searchedUsers = [];
  }
}
