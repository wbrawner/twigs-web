import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

export interface UserService {
  getUsersByUsername(username: string): Observable<User[]>;
}

export let USER_SERVICE = new InjectionToken<UserService>('user.service');
