import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../users/user';
import { Account } from './account';

export interface AccountService {
  getAccounts(): Observable<Account[]>;
  getAccount(id: string): Observable<Account>;
  createAccount(
    name: string,
    description: string,
    currency: string,
    members: User[],
  ): Observable<Account>;
  updateAccount(id: string, changes: object): Observable<Account>;
  deleteAccount(id: string): Observable<boolean>;
}

export let ACCOUNT_SERVICE = new InjectionToken<AccountService>('account.service');
