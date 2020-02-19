import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { TwigsService, TWIGS_SERVICE } from '../../shared/twigs.service';
import { User } from '../user';
import { Actionable } from 'src/app/actionable';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, Actionable {

  public email: string;
  public password: string;

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.app.title = 'Login';
    this.app.actionable = this;
    this.app.backEnabled = true;
  }

  ngOnDestroy() {
    this.app.actionable = null;
  }

  doAction(): void {
    this.twigsService.login(this.email, this.password)
      .subscribe(user => {
        this.app.user = user;
        this.router.navigate(['/'])
      },
      error => {
        console.error(error)
        alert("Login failed. Please verify you have the correct credentials");
      })
  }

  getActionLabel() {
    return 'Submit';
  }
}
