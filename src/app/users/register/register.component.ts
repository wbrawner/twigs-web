import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { Actionable } from 'src/app/actionable';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy, Actionable {

  public user: User = new User();
  public confirmedPassword: string;

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
    if (this.user.password !== this.confirmedPassword) {
      alert('Passwords don\'t match');
      return;
    }
    this.authService.register(this.user.email, this.user.password);
  }

  getActionLabel() {
    return 'Submit';
  }
}
