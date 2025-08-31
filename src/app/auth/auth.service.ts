import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  email?: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiURL;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }

  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, registerData, {
      withCredentials: true
    });
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, loginData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.userSubject.next({
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName
        });
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        this.isAuthenticatedSubject.next(false);
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }),
      catchError(() => {
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of(null);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/auth/me`, {
      withCredentials: true
    }).pipe(
      tap(user => {
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(() => {
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of({});
      })
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  private checkAuthenticationStatus(): void {
    this.getCurrentUser().subscribe();
  }

  updateUserData(userData: User): void {
    this.userSubject.next(userData);
  }
}