import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';
import { capitalizeNames } from '../utils/name-utils';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>account_circle</mat-icon>
            Edit Profile
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" class="name-input">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" class="name-input">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <div class="button-group">
              <button
                type="button"
                mat-stroked-button
                (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Cancel
              </button>
              
              <button
                type="submit"
                mat-raised-button
                color="primary"
                [disabled]="profileForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20" class="button-spinner"></mat-spinner>
                <mat-icon *ngIf="!isLoading">save</mat-icon>
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
      background-color: #f5f5f5;
    }

    .profile-card {
      width: 100%;
      max-width: 500px;
      min-height: 400px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;
    }

    .full-width {
      width: 100%;
    }

    .button-group {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 20px;
    }

    .button-spinner {
      margin-right: 8px;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
    }

    /* Mobile responsive */
    @media (max-width: 600px) {
      .profile-container {
        padding: 10px;
        align-items: flex-start;
        min-height: calc(100vh - 56px);
      }

      .profile-card {
        max-width: none;
        margin-top: 20px;
      }

      .button-group {
        flex-direction: column;
      }

      mat-card-title {
        font-size: 20px;
      }
    }

    .name-input {
      text-transform: capitalize;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit() {
    // Load current user data from auth service (already cached)
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.profileForm.patchValue({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || ''
      });
    } else {
      // Fallback: fetch from API if not in cache
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.profileForm.patchValue({
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || ''
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to load user data', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Transform names before saving
      const profileData = {
        ...this.profileForm.value,
        firstName: capitalizeNames(this.profileForm.value.firstName || ''),
        lastName: capitalizeNames(this.profileForm.value.lastName || '')
      };
      
      this.userService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          this.snackBar.open(response.message, 'Close', {
            duration: 3000
          });
          
          if (response.requireReLogin) {
            // If email changed, redirect to login
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            // Update AuthService with the new user data from response
            if (response.user) {
              // Directly update the AuthService with the new user data
              this.authService.updateUserData(response.user);
            }
            this.goBack();
          }
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Failed to update profile. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}