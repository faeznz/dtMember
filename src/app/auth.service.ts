// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl = 'https://ill-ruby-jay-kit.cyclic.app/'; 
  private loggedIn = false; // Menyimpan status login pengguna
  private username: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.serverUrl}/login`, { username, password })
      .pipe(
        map(response => {
          // Simpan token JWT yang diterima dalam local storage atau cookie
          localStorage.setItem('token', response.token);
          this.loggedIn = true;
          this.username = username;
          return response;
        })
      );
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('token'); // Hapus token dari local storage atau cookie
    this.router.navigate(['/']); // Redirect ke halaman login setelah logout
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsername(): string {
    return this.username;
  }
}
