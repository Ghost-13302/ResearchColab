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
  isModal       = input(false);
  close         = output<void>();
  switchToLogin = output<void>();

  hide    = signal(true);
  loading = signal(false);
  toast   = signal<{ msg: string; type: 'ok' | 'err' } | null>(null);

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
    this.toast.set(null);
    const { email, password } = this.form.value;
    this.accountService.register({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.set({ msg: '✔ ACCOUNT CREATED! REDIRECTING TO LOGIN…', type: 'ok' });
        setTimeout(() => {
          if (this.isModal()) { this.switchToLogin.emit(); } else { this.router.navigate(['/login']); }
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.error ?? err?.error?.message ?? 'REGISTRATION FAILED. PLEASE TRY AGAIN.';
        this.toast.set({ msg: `✕ ${msg.toUpperCase()}`, type: 'err' });
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
