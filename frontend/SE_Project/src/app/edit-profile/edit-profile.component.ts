import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../services/user.service';
import { pageAnimation } from '../animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  animations: [pageAnimation],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  private snackBar = inject(MatSnackBar);
  private userId = localStorage.getItem('userId') ?? '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.userId) { this.router.navigate(['/']); return; }

    this.profileForm = this.fb.group({
      full_name:   ['', Validators.required],
      affiliation: [''],
      bio:         [''],
      email:       [{ value: '', disabled: true }],
    });

    this.userService.getProfile(this.userId).subscribe({
      next: (data) => this.profileForm.patchValue(data),
      error: () => this.snackBar.open('Failed to load profile.', 'Close', { duration: 4000, verticalPosition: 'top' }),
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    const { full_name, affiliation, bio } = this.profileForm.value;
    this.userService.updateProfile(this.userId, { full_name, affiliation, bio }).subscribe({
      next: (res) => this.snackBar.open(res.message || 'Profile updated!', 'Close', { duration: 3000, verticalPosition: 'top' }),
      error: () => this.snackBar.open('Failed to update profile.', 'Close', { duration: 4000, verticalPosition: 'top' }),
    });
  }
}
