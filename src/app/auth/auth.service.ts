// Angular core imports
import { Injectable } from '@angular/core';           // Makes this class available for dependency injection
import { HttpClient } from '@angular/common/http';     // For making HTTP requests to the backend
import { Observable, BehaviorSubject } from 'rxjs';    // For handling async operations
import { tap, catchError } from 'rxjs/operators';     // RxJS operators for transforming data
import { environment } from '../../environments/environment'; // Configuration (API URL, etc.)
import { of } from 'rxjs';                            // Creates observable from static value

// Interface defines the structure of registration data
// This ensures type safety when sending data to the backend
export interface RegisterRequest {
  email: string;           // Required: user's email address
  password: string;        // Required: user's password
  firstName?: string;      // Optional: ? means this field is not required
  lastName?: string;       // Optional: user's last name
}

// Interface for login credentials
export interface LoginRequest {
  email: string;           // User's email address
  password: string;        // User's password
}

// Interface for what the backend returns after successful login
export interface LoginResponse {
  email?: string;          // User's email (optional in case backend doesn't send it)
  firstName?: string;      // User's first name
  lastName?: string;       // User's last name
  profilePicture?: string; // URL/path to user's profile picture
}

// Interface representing a user in our application
// This is what we store in our AuthService to track the current user
export interface User {
  email?: string;          // User's email address
  firstName?: string;      // User's first name
  lastName?: string;       // User's last name
  profilePicture?: string; // URL/path to profile picture
}

// @Injectable makes this service available throughout the app
// 'root' means Angular creates one instance for the entire application
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Get the backend API URL from environment configuration
  private apiUrl = environment.apiURL;
  
  // BehaviorSubject is like a variable that notifies when it changes
  // It holds the current user data and notifies components when user logs in/out
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable(); // Components can "watch" this
  
  // Track whether user is authenticated (logged in)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Constructor runs when Angular creates this service
  // Angular automatically provides HttpClient (dependency injection)
  constructor(private http: HttpClient) {
    // Check if user is already logged in when the service starts
    this.checkAuthenticationStatus();
  }

  // Register a new user account
  // Returns an Observable - components must subscribe to get the result
  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, registerData, {
      withCredentials: true  // Include cookies in the request (important for authentication)
    });
  }

  // Log in a user with email and password
  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, loginData, {
      withCredentials: true  // Send cookies - backend will create authentication cookie
    }).pipe(
      // tap() runs side effects without changing the data
      tap(response => {
        // On successful login, store user data in our service
        const userData = {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          profilePicture: response.profilePicture
        };
        // Update our "watched" variables - components will be notified
        this.userSubject.next(userData);         // Store user data
        this.isAuthenticatedSubject.next(true);  // Mark as authenticated
      }),
      // catchError() handles any errors that occur
      catchError(error => {
        this.isAuthenticatedSubject.next(false);  // Mark as not authenticated
        throw error;  // Re-throw error so component can handle it
      })
    );
  }

  // Log out the current user
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/logout`, {}, {
      withCredentials: true  // Send cookies so backend knows which user to log out
    }).pipe(
      tap(() => {
        // On successful logout, clear user data
        this.userSubject.next(null);              // Clear user data
        this.isAuthenticatedSubject.next(false);  // Mark as not authenticated
      }),
      catchError(() => {
        // Even if logout fails, clear local state
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of(null);  // Return a "dummy" observable so app doesn't crash
      })
    );
  }

  // Get current user information from the backend
  // Used to check if user is still logged in (cookie still valid)
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/auth/me`, {
      withCredentials: true  // Send authentication cookie
    }).pipe(
      tap(user => {
        // If successful, user is authenticated
        this.userSubject.next(user);             // Store user data
        this.isAuthenticatedSubject.next(true);  // Mark as authenticated
      }),
      catchError(() => {
        // If error (401, 500, etc.), user is not authenticated
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of({});  // Return empty object so app doesn't crash
      })
    );
  }

  // Get current authentication status (synchronous)
  // Returns true if user is logged in, false if not
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;  // .value gets current value without subscribing
  }

  // Get current user data (synchronous)
  // Returns user object if logged in, null if not
  getUser(): User | null {
    return this.userSubject.value;  // .value gets current value without subscribing
  }

  // Private method called when service starts
  // Checks if user is already logged in (has valid cookie)
  private checkAuthenticationStatus(): void {
    this.getCurrentUser().subscribe();  // Subscribe to trigger the HTTP request
    // We don't need to handle the result - getCurrentUser() updates our state
  }

  // Update user data in the service (used after profile updates)
  // This notifies all components watching user$ that the data changed
  updateUserData(userData: User): void {
    this.userSubject.next(userData);  // Update the "watched" user data
  }
}