import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Actionable } from '../actionable';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, Actionable {

  public user: User = new User();

  constructor(
    private app: AppComponent,
    private authService: AuthService,
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
    this.authService.login(this.user);
  }

  getActionLabel() {
    return 'Submit';
  }
}
