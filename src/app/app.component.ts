import { Component, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Actionable } from './actionable';
import { User } from './users/user';
import { TWIGS_SERVICE, TwigsService } from './shared/twigs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Twigs';
  public backEnabled = false;
  public actionable: Actionable;
  public user: User;

  constructor(
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private location: Location,
  ) {
    this.twigsService.getProfile().subscribe(user => {
      this.user = user;
    });
   }

  getUsername(): String {
    return this.user.username;
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.twigsService.logout().subscribe(_ => {
      this.location.go('/');
    });
  }

  isLoggedIn() {
    return this.user != null;
  }
}
