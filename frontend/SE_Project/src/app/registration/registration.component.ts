import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { pageAnimation } from '../animations';

const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pw      = group.get('password')?.value;
  const confirm = group.get('confirmPwd')?.value;
  return pw && confirm && pw !== confirm ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  animations: [pageAnimation],
})
export class RegistrationComponent {
  isModal      = input(false);
  close        = output<void>();
  switchToLogin = output<void>();

  hide    = signal(true);
  loading = signal(false);
  private snackBar = inject(MatSnackBar);

  constructor(private router: Router, private accountService: AccountService) {}

  form = new FormGroup(
    {
      email:      new FormControl('', [Validators.required, Validators.email]),
      password:   new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPwd: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator }
  );

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { email, password } = this.form.value;
    this.accountService.register({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Account created! Please log in.', 'OK', {
          duration: 4000, verticalPosition: 'top',
        });
        if (this.isModal()) { this.switchToLogin.emit(); } else { this.router.navigate(['/login']); }
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? 'Registration failed. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 5000, verticalPosition: 'top' });
      },
    });
  }

  onLogin() {
    if (this.isModal()) { this.switchToLogin.emit(); } else { this.router.navigate(['/login']); }
  }

  onBack() {
    if (this.isModal()) { this.close.emit(); } else { this.router.navigate(['/']); }
  }
}
