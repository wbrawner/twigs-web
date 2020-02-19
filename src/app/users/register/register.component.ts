import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TwigsService, TWIGS_SERVICE } from '../../shared/twigs.service';
import { Actionable } from 'src/app/actionable';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy, Actionable {

  public username: string;
  public email: string;
  public password: string;
  public confirmedPassword: string;

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.app.title = 'Register';
    this.app.actionable = this;
    this.app.backEnabled = true;
  }

  ngOnDestroy() {
    this.app.actionable = null;
  }

  doAction(): void {
    if (this.password !== this.confirmedPassword) {
      alert('Passwords don\'t match');
      return;
    }
    this.twigsService.register(this.username, this.email, this.password).subscribe(user => {
      console.log(user);
      this.router.navigate(['/'])
    }, error => {
      console.error(error);
      alert("Registration failed!")
    })
  }

  getActionLabel() {
    return 'Submit';
  }
}
