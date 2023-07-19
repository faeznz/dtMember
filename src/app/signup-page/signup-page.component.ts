import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit{
  member: any = {};
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    const userData = { username: this.username, password: this.password };
    this.http.post<any>('https://ill-ruby-jay-kit.cyclic.app/users', userData)
      .subscribe(
        response => {
          // Save the token in the browser's local storage
          localStorage.setItem('token', response.token);
          // Redirect to the protected profile page
          // Replace '/profile' with the actual URL of your protected profile page
          window.location.href = '/profile';
        },
        error => {
          console.error('Login error', error);
          this.errorMessage = error.error;
        }
      );
  }
}
