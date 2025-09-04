import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  user$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  isMobile$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.user$ = this.authService.user$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map((result: any) => result.matches));
  }

  getProfilePictureUrl(user: User | null): string | null {
    if (user?.profilePicture) {
      return `${environment.apiURL}${user.profilePicture}`;
    }
    return null;
  }

  getDisplayName(user: User | null): string {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.email || 'User';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
