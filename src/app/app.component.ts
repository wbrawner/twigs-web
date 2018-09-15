import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Actionable } from './actionable';
import { AuthService } from './auth.service';

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
    private location: Location
  ) { }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }
}
