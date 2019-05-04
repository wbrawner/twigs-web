import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Actionable } from './actionable';
import { AuthService } from './users/auth.service';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Budget';
  public backEnabled = false;
  public actionable: Actionable;
  public group = 'MG3KOiuPu0Xy38O2LdhJ';

  constructor(
    public authService: AuthService,
    private location: Location,
  ) {
    const config = {
      apiKey: 'AIzaSyALYI-ILmLV8NBNXE3DLF9yf1Z5Pp-Y1Mk',
      authDomain: 'budget-c7da5.firebaseapp.com',
      databaseURL: 'https://budget-c7da5.firebaseio.com',
      projectId: 'budget-c7da5',
      storageBucket: 'budget-c7da5.appspot.com',
      messagingSenderId: '527070722499'
    };
    firebase.initializeApp(config);
  }

  getUsername(): String {
    return firebase.auth().currentUser.email;
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn() {
    return firebase.auth().currentUser != null;
  }
}
