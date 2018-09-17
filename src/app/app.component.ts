import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Actionable } from './actionable';
import { AuthService } from './auth.service';
import { BudgetDatabase } from './budget-database';

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
  ) { }

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
}
