import { Component, HostListener } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentRoute!: string;
  isMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuButton = document.querySelector('.menu-button') as HTMLElement;

    // Close menu if the clicked element is not the menu button or its child elements
    if (!menuButton.contains(target)) {
      this.isMenuOpen = false;
    }
  }
}
