import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { UserService } from './user.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export class FirestoreUserService implements UserService {
  getUsersByUsername(username: string): Observable<User[]> {
      return Observable.create(subscriber => {
          
      })
  }
}
