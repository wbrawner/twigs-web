import { Component, Inject, ApplicationRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { User } from './users/user';
import { TWIGS_SERVICE, TwigsService } from './shared/twigs.service';
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
export class AppComponent implements OnInit {
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
        private router: Router,
        private appRef: ApplicationRef,
        private updates: SwUpdate,
        private changeDetector: ChangeDetectorRef,
        private storage: Storage,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit(): void {
        const unauthenticatedRoutes = [
            '',
            '/',
            '/login',
            '/register'
        ]
        let auth = this.storage.getItem('Authorization');
        let userId = this.storage.getItem('userId');
        let savedUser = JSON.parse(this.storage.getItem('user')) as User;
        if (auth && auth.length == 255 && userId) {
            if (savedUser) {
                this.user.next(savedUser);
            }
            this.twigsService.getProfile(userId).then(fetchedUser => {
                this.storage.setItem('user', JSON.stringify(fetchedUser));
                this.user.next(fetchedUser);
                if (unauthenticatedRoutes.indexOf(this.location.path()) != -1) {
                    //TODO: Save last opened budget and redirect to there instead of the main list
                    this.router.navigateByUrl("/budgets");
                }
            });
        } else if (unauthenticatedRoutes.indexOf(this.location.path()) == -1) {
            this.router.navigateByUrl(`/login?redirect=${this.location.path()}`);
        }

        this.updates.versionUpdates.subscribe(
            event => {
                if (event.type == "VERSION_READY") {
                    console.log('current version is', event.currentVersion);
                    console.log('available version is', event.latestVersion);
                    // TODO: Prompt user to click something to update
                    this.updates.activateUpdate();
                }
            },
            err => {

            }
        );

        const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
        const everySixHours$ = interval(6 * 60 * 60 * 1000);
        const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
        everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
        this.user.subscribe(
            user => {
                if (user) {
                    this.loggedIn = true;
                } else {
                    this.loggedIn = false;
                }
            }
        )
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
        this.handleDarkModeChanges(darkMode);
        darkMode.addEventListener('change', (e => this.handleDarkModeChanges(e)))
    }

    getUsername(): String {
        return this.user.value.username;
    }

    goBack(): void {
        this.location.back();
    }

    logout(): void {
        this.twigsService.logout().then(_ => {
            this.location.go('/');
            window.location.reload();
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

    handleDarkModeChanges(darkMode: any) {
        const themeColor = this.document.getElementsByName('theme-color')[0] as HTMLMetaElement;
        let themeColorValue: string;
        if (darkMode.matches) {
            themeColorValue = '#333333';
        } else {
            themeColorValue = '#F1F1F1';
        }
        themeColor.content = themeColorValue;
    }
}
