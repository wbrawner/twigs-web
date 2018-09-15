import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    console.log('AuthService constructed');
  }

  login(user: User) {
    this.apiService.login(user.name, user.password).subscribe(
      value => {
        this.currentUser = value;
        this.router.navigate(['/']);
      },
      error => {
        console.log('Login failed');
        console.log(error);
      }
    );
  }

  register(user: User) {
    this.apiService.register(user.name, user.email, user.password).subscribe(
      value => {
        this.login(value);
      },
      error => {
        console.log('Registration failed');
        console.log(error);
      }
    );
  }

  logout() {
    this.apiService.logout().subscribe(
      value => {
        window.location.reload();
      },
      error => {
        console.log('Logout failed');
        console.log(error);
      }
    );
  }
}
