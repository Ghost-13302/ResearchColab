import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { pageAnimation } from '../animations';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, HeaderComponent],
  animations: [pageAnimation],
})
export class HomeComponent implements OnInit {
  isLoggedIn = signal(!!localStorage.getItem('token'));
  cursorVisible = signal(true);

  constructor(private router: Router) {}

  ngOnInit() {
    setInterval(() => this.cursorVisible.set(!this.cursorVisible()), 530);
  }

  goToProjects() {
    this.router.navigate(this.isLoggedIn() ? ['/projects'] : ['/registration']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }
}
