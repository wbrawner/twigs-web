import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from './user';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  login(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(value => {
      this.router.navigate(['/']);
    }).catch(err => {
      console.log('Login failed');
      console.log(err);
    });
  }

  // register(user: User) {
  //   this.apiService.register(user.name, user.email, user.password).subscribe(
  //     value => {
  //       this.login(value);
  //     },
  //     error => {
  //       console.log('Registration failed');
  //       console.log(error);
  //     }
  //   );
  // }

  logout() {
    firebase.auth().signOut().then(value => {
      window.location.reload();
    });
  }
}
