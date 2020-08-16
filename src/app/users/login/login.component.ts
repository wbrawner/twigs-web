import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { TwigsService, TWIGS_SERVICE } from '../../shared/twigs.service';
import { User } from '../user';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public isLoading = false;
  public email: string;
  public password: string;

  constructor(
    private app: AppComponent,
    @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.app.title = 'Login';
    this.app.backEnabled = true;
  }

  login(): void {
    this.isLoading = true;
    this.twigsService.login(this.email, this.password)
      .subscribe(user => {
        this.app.user.next(user);
        this.router.navigate(['/'])
      },
      error => {
        console.error(error)
        alert("Login failed. Please verify you have the correct credentials");
        this.isLoading = false;
      })
  }
}
