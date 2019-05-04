import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Actionable } from 'src/app/actionable';
import { AppComponent } from 'src/app/app.component';

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
    this.authService.login(this.email, this.password);
  }

  getActionLabel() {
    return 'Submit';
  }
}
