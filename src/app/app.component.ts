import { Component, Inject, ApplicationRef } from '@angular/core';
import { Location } from '@angular/common';
import { User } from './users/user';
import { TWIGS_SERVICE, TwigsService } from './shared/twigs.service';
import { CookieService } from 'ngx-cookie-service';
import { SwUpdate } from '@angular/service-worker';
import { first, filter, map } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { Actionable, isActionable } from './shared/actionable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Twigs';
  public backEnabled = false;
  public user: User;
  public online = window.navigator.onLine;
  public currentVersion = '';
  public actionable: Actionable;

  constructor(
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private location: Location,
    private cookieService: CookieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appRef: ApplicationRef,
    private updates: SwUpdate,
  ) {
    if (this.cookieService.check('Authorization')) {
      this.twigsService.getProfile().subscribe(user => {
        this.user = user;
        if (this.activatedRoute.pathFromRoot.length == 0) {
          this.router.navigateByUrl("/budgets")
        }
      });
    } else {
      this.router.navigateByUrl("/login")
    }

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      // TODO: Prompt user to click something to update
      updates.activateUpdate();
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
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
