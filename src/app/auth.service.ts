import { Injectable } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
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

  register(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(value => {
      this.router.navigate(['/']);
    }).catch(err => {
      console.log('Login failed');
      console.log(err);
    });
  }

  logout() {
    firebase.auth().signOut().then(value => {
      window.location.reload();
    });
  }
}
