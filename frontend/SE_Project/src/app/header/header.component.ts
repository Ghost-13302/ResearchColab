import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvitationsModalComponent } from '../invitations-modal/invitations-modal.component';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, InvitationsModalComponent, LoginComponent, RegistrationComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  mobileMenuOpen   = signal(false);
  dropdownOpen     = signal(false);
  showInvitationsModal = signal(false);
  showLoginModal   = signal(false);
  showRegisterModal = signal(false);

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getDisplayName(): string {
    const email = localStorage.getItem('userEmail');
    if (!email) return 'PLAYER';
    const name = email.split('@')[0].toUpperCase();
    return name.length > 12 ? name.substring(0, 12) + '…' : name;
  }

  navigate(path: string) {
    this.mobileMenuOpen.set(false);
    this.dropdownOpen.set(false);
    this.router.navigate([path]);
  }

  goHome()    { this.navigate('/'); }
  goToAbout() { this.navigate('/about'); }
  goToProfile() { this.navigate('/edit-profile'); }

  goToProjects() {
    this.mobileMenuOpen.set(false);
    if (!this.isLoggedIn()) { this.openLogin(); } else { this.navigate('/projects'); }
  }

  goToInvitations() {
    this.mobileMenuOpen.set(false);
    if (!this.isLoggedIn()) { this.openLogin(); } else { this.showInvitationsModal.set(true); }
  }

  openLogin() {
    this.showRegisterModal.set(false);
    this.showLoginModal.set(true);
    this.mobileMenuOpen.set(false);
  }

  openRegister() {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(true);
    this.mobileMenuOpen.set(false);
  }

  closeAuth() {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(false);
  }

  hideInvitationsModal() { this.showInvitationsModal.set(false); }

  toggleDropdown() { this.dropdownOpen.set(!this.dropdownOpen()); }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.dropdownOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
