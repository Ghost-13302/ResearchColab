import { Component, OnInit, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { pageAnimation } from '../animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [pageAnimation],
})
export class LoginComponent implements OnInit {
  isModal = input(false);
  close         = output<void>();
  switchToRegister = output<void>();

  hide    = signal(true);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Please enter a valid email and password.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', String(res.user_id));
        this.loading.set(false);
        if (this.isModal()) { this.close.emit(); }
        this.router.navigate(['/projects']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 401 ? 'Invalid email or password.' : 'Login failed. Please try again.'
        );
      },
    });
  }

  onSignup() {
    if (this.isModal()) { this.switchToRegister.emit(); } else { this.router.navigate(['/registration']); }
  }

  onBack() {
    if (this.isModal()) { this.close.emit(); } else { this.router.navigate(['/']); }
  }
}
