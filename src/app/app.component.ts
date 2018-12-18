import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Actionable } from './actionable';
import { AuthService } from './auth.service';
import { BudgetDatabase } from './budget-database';
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

  constructor(
    public authService: AuthService,
    private location: Location,
    private db: BudgetDatabase,
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

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }

  exportData(): void {
    this.db.export().subscribe(data => {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = 'budget.json';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  isLoggedIn() {
    return firebase.auth().currentUser != null;
  }
}
