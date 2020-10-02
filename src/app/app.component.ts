import { Component, Inject, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { User } from './users/user';
import { TWIGS_SERVICE, TwigsService } from './shared/twigs.service';
import { CookieService } from 'ngx-cookie-service';
import { SwUpdate } from '@angular/service-worker';
import { first, filter, map } from 'rxjs/operators';
import { interval, concat, BehaviorSubject } from 'rxjs';
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
  public user = new BehaviorSubject<User>(null);
  public online = window.navigator.onLine;
  public currentVersion = '';
  public actionable: Actionable;
  public loggedIn = false;

  constructor(
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private location: Location,
    private cookieService: CookieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appRef: ApplicationRef,
    private updates: SwUpdate,
    private changeDetector: ChangeDetectorRef,
  ) {
    if (this.cookieService.check('Authorization')) {
      this.twigsService.getProfile().subscribe(user => {
        this.user.next(user);
        if (this.activatedRoute.pathFromRoot.length == 0) {
          this.router.navigateByUrl("/budgets")
        }
      });
    } else {
      this.router.navigateByUrl("/login")
    }

    updates.available.subscribe(
      event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        // TODO: Prompt user to click something to update
        updates.activateUpdate();
      },
      err => {

      }
    );
    updates.activated.subscribe(
      event => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      },
      err => {

      }
    );

    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
    this.user.subscribe(
      user => {
        if (user) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      }
    )
  }

  getUsername(): String {
    return this.user.value.username;
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.twigsService.logout().subscribe(_ => {
      this.location.go('/');
    });
  }

  setActionable(actionable: Actionable): void {
    this.actionable = actionable;
    this.changeDetector.detectChanges();
  }

  setBackEnabled(enabled: boolean): void {
    this.backEnabled = enabled;
    this.changeDetector.detectChanges();
  }

  setTitle(title: string) {
    this.title = title;
    this.changeDetector.detectChanges();
  }
}
