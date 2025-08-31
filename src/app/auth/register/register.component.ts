import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { capitalizeNames } from '../../utils/name-utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_add</mat-icon>
            Create Account
          </mat-card-title>
          <mat-card-subtitle>Join us today! Please fill in your information.</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="name-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" class="name-input">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" class="name-input">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required>
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              <mat-icon>error</mat-icon>
              {{ errorMessage }}
            </div>

            <div class="success-message" *ngIf="successMessage">
              <mat-icon>check_circle</mat-icon>
              {{ successMessage }}
            </div>

            <button
              type="submit"
              mat-raised-button
              color="primary"
              class="register-button"
              [disabled]="registerForm.invalid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!isLoading">person_add</mat-icon>
              Create Account
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="card-actions-center">
          <p>Already have an account? 
            <button mat-button color="primary" (click)="goToLogin()">
              Sign in here
            </button>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .register-card {
      width: 100%;
      max-width: 500px;
      min-height: 600px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;
    }

    .name-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .register-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      margin-top: 20px;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      background-color: #ffebee;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4caf50;
      background-color: #e8f5e8;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
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

    .card-actions-center {
      justify-content: center;
      text-align: center;
    }

    .card-actions-center p {
      margin: 16px 0;
      color: rgba(0, 0, 0, 0.6);
    }

    /* Mobile responsive */
    @media (max-width: 600px) {
      .register-container {
        padding: 10px;
        align-items: flex-start;
        min-height: 100vh;
      }

      .register-card {
        max-width: none;
        margin-top: 20px;
        min-height: auto;
      }

      .name-row {
        flex-direction: column;
        gap: 0;
      }

      .half-width {
        width: 100%;
      }

      mat-card-title {
        font-size: 20px;
      }

      .register-button {
        height: 44px;
      }
    }

    .name-input {
      text-transform: capitalize;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const registerData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: capitalizeNames(this.registerForm.value.firstName || ''),
        lastName: capitalizeNames(this.registerForm.value.lastName || '')
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! You can now login.';
          setTimeout(() => {
            this.goToLogin();
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}