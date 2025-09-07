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
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';
import { capitalizeNames } from '../utils/name-utils';
import { environment } from '../../environments/environment';

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
    MatSnackBarModule,
    MatDividerModule
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
          <!-- Profile Picture Section -->
          <div class="profile-picture-section">
            <div class="current-picture">
              @if (getProfilePictureUrl()) {
                <img [src]="getProfilePictureUrl()" alt="Profile Picture" class="profile-picture">
              } @else {
                <mat-icon class="default-avatar">account_circle</mat-icon>
              }
            </div>
            
            <div class="picture-upload">
              <input type="file" 
                     #fileInput 
                     (change)="onFileSelected($event)" 
                     accept=".jpg,.jpeg,.png"
                     style="display: none;">
              
              <button type="button" 
                      mat-stroked-button 
                      (click)="fileInput.click()"
                      [disabled]="isLoading">
                <mat-icon>photo_camera</mat-icon>
                Choose File
              </button>
              
              @if (selectedFile) {
                <button type="button" 
                        mat-raised-button 
                        color="primary"
                        (click)="uploadProfilePicture()"
                        [disabled]="isLoading">
                  <mat-spinner *ngIf="isLoading" diameter="16" class="upload-spinner"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">upload</mat-icon>
                  Upload Picture
                </button>
                
                <button type="button" 
                        mat-stroked-button 
                        (click)="removePreview()"
                        [disabled]="isLoading">
                  <mat-icon>close</mat-icon>
                  Cancel
                </button>
              }
              
              <p class="upload-hint">Supports JPG and PNG (max 5MB)</p>
            </div>
          </div>

          <mat-divider></mat-divider>

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
      align-items: flex-start;
      min-height: calc(100vh - 64px);
      padding: 40px 20px;
      background-color: #f5f5f5;
    }

    .profile-card {
      width: 100%;
      max-width: 800px;
      min-height: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

    /* Tablet responsive */
    @media (max-width: 768px) {
      .profile-container {
        padding: 30px 15px;
      }

      .profile-card {
        max-width: 600px;
      }
    }

    /* Mobile responsive */
    @media (max-width: 600px) {
      .profile-container {
        padding: 20px 10px;
        align-items: flex-start;
        min-height: calc(100vh - 56px);
      }

      .profile-card {
        max-width: none;
        margin-top: 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .button-group {
        flex-direction: column;
      }

      mat-card-title {
        font-size: 20px;
      }

      .profile-form {
        gap: 16px;
      }
    }

    @media (max-width: 480px) {
      .profile-container {
        padding: 15px 5px;
      }

      .profile-card {
        margin: 0;
      }

      mat-card-content {
        padding: 16px !important;
      }
    }

    .name-input {
      text-transform: capitalize;
    }

    .profile-picture-section {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem 0;
    }

    .current-picture {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .profile-picture {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e0e0e0;
    }

    .default-avatar {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #9e9e9e;
    }

    .picture-upload {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .upload-hint {
      font-size: 12px;
      color: #666;
      margin: 0;
    }

    .upload-spinner {
      margin-right: 8px;
    }

    mat-divider {
      margin: 1rem 0;
    }

    /* Mobile responsive for profile picture */
    @media (max-width: 600px) {
      .profile-picture-section {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .picture-upload {
        align-items: center;
      }

      .profile-picture, .default-avatar {
        width: 100px;
        height: 100px;
        font-size: 100px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentProfilePicture: string | null = null;

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
      this.currentProfilePicture = currentUser.profilePicture || null;
    } else {
      // Fallback: fetch from API if not in cache
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.profileForm.patchValue({
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || ''
          });
          this.currentProfilePicture = user.profilePicture || null;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        this.snackBar.open('Only JPG and PNG files are allowed', 'Close', {
          duration: 3000
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size cannot exceed 5MB', 'Close', {
          duration: 3000
        });
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture() {
    if (!this.selectedFile) {
      return;
    }
    
    this.isLoading = true;
    this.userService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.currentProfilePicture = response.profilePicture;
        this.imagePreview = null;
        this.selectedFile = null;
        
        // Update auth service with new profile picture
        const currentUser = this.authService.getUser();
        if (currentUser) {
          this.authService.updateUserData({
            ...currentUser,
            profilePicture: response.profilePicture
          });
        }

        this.snackBar.open(response.message, 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Failed to upload profile picture';
        this.snackBar.open(message, 'Close', {
          duration: 3000
        });
      }
    });
  }

  removePreview() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  getProfilePictureUrl() {
    if (this.imagePreview) return this.imagePreview;
    if (this.currentProfilePicture) {
      const url = `${environment.apiURL}${this.currentProfilePicture}`;
      return url;
    }
    return null;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}