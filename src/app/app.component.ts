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
  isMenuOpen: boolean = false;

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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const isMenuClicked = targetElement.matches('.toggle-menu, .toggle-menu i');
    const isMenuOpen = this.isMenuOpen;

    if (!isMenuClicked && isMenuOpen) {
      this.toggleMenu();
    }
  }
}
