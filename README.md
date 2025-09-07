# Angular Frontend - Beginner's Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Angular Commands](#angular-commands)
3. [Project Structure](#project-structure)
4. [Understanding Observables](#understanding-observables)
5. [Data Flow: API → Service → Component](#data-flow)
6. [Authentication System](#authentication-system)
7. [Components Explained](#components-explained)
8. [Services Explained](#services-explained)
9. [How Everything Works Together](#how-everything-works-together)

---

## 🎯 Project Overview

This is an Angular application that provides user authentication and profile management with file upload capabilities. It communicates with a .NET Web API backend using HTTP requests and cookies for authentication.

**What this app does:**
- User registration and login
- Profile editing with picture uploads
- CRUD operations for laptops
- Cookie-based authentication (no JWT tokens needed)

---

## 🚀 Angular Commands

### Essential Commands You'll Use Daily

```bash
# Start development server (like hitting F5 in Visual Studio)
ng serve
# or
npm start
# → Opens app at http://localhost:4200
# → Auto-refreshes when you save files

# Build for production (like Release build in Visual Studio)
ng build

# Run tests
ng test

# Install dependencies (like NuGet restore)
npm install

# Generate new components/services
ng generate component profile
ng generate service auth
```

### When to Use Each Command

- **`ng serve`**: Every time you want to run the app during development
- **`ng build`**: When you want to create files ready for deployment
- **`npm install`**: After cloning project or when package.json changes
- **`ng generate`**: When you need new components or services

---

## 📁 Project Structure

```
src/
├── app/                          # Main application code
│   ├── auth/                     # Authentication logic
│   │   └── auth.service.ts       # Handles login/logout/user state
│   ├── components/               # Reusable UI components
│   ├── profile/                  # Profile page component
│   │   ├── profile.component.ts  # Profile logic
│   │   └── profile.component.html # Profile template
│   ├── services/                 # Data services
│   │   └── user.service.ts       # API calls for user operations
│   ├── app.component.ts          # Root component
│   └── app.routes.ts             # Page navigation rules
├── environments/                 # Configuration files
│   └── environment.ts            # API URLs, settings
└── assets/                       # Images, icons, static files
```

### What Each Folder Does

- **`auth/`**: Everything related to logging in/out and checking if user is authenticated
- **`components/`**: Reusable pieces of UI (like buttons, forms, menus)
- **`services/`**: Classes that talk to the backend API and manage data
- **`environments/`**: Configuration that changes between development and production

---

## 🔄 Understanding Observables

### What Are Observables?

Think of Observables like a **subscription to a newsletter**:

```typescript
// Like subscribing to a newsletter
userService.getCurrentUser().subscribe({
  next: (user) => {
    // This runs when the "newsletter arrives" (API responds with data)
    console.log('Got user:', user);
  },
  error: (error) => {
    // This runs if there's a problem (API is down, network error)
    console.log('Error:', error);
  }
});
```

### Why Not Just Regular Functions?

```typescript
// ❌ This won't work - API calls take time
const user = userService.getCurrentUser(); // undefined!
console.log(user.name); // ERROR!

// ✅ This works - we wait for the response
userService.getCurrentUser().subscribe(user => {
  console.log(user.name); // Works!
});
```

### Key Observable Concepts

1. **Asynchronous**: API calls happen in the background
2. **Subscribe**: Like saying "tell me when you get the data"
3. **Unsubscribe**: Like canceling a subscription (important to prevent memory leaks)

---

## 📊 Data Flow: API → Service → Component

### The Journey of Data

```
1. User clicks button
    ↓
2. Component calls Service method
    ↓
3. Service makes HTTP request to Backend
    ↓
4. Backend responds with data
    ↓
5. Service receives response
    ↓
6. Component gets data via Observable
    ↓
7. Component updates UI
```

### Real Example: Loading User Profile

```typescript
// 1. Component (profile.component.ts)
ngOnInit() {
  // 2. Call service method
  this.authService.getCurrentUser().subscribe({
    next: (user) => {
      // 6. Update component data
      this.currentUser = user;
    }
  });
}

// 3. Service (auth.service.ts) 
getCurrentUser(): Observable<User> {
  // 4. Make HTTP request
  return this.http.get<User>(`${this.apiUrl}/api/auth/me`, {
    withCredentials: true  // 5. Include cookies
  });
}
```

---

## 🔐 Authentication System

### How Cookie Authentication Works

1. **Login**: User enters email/password
2. **Backend creates cookie**: Sends encrypted cookie to browser
3. **Browser stores cookie**: Automatically includes it in future requests
4. **Backend validates cookie**: Checks if user is still logged in

### Why Cookies Instead of JWT Tokens?

```typescript
// ❌ With JWT, you'd have to manually add tokens to every request
this.http.get('/api/data', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// ✅ With cookies, browser handles it automatically
this.http.get('/api/data', {
  withCredentials: true  // Browser automatically sends cookie
});
```

### Authentication State Management

```typescript
// AuthService manages who's logged in
export class AuthService {
  // BehaviorSubject = like a variable that notifies when it changes
  private userSubject = new BehaviorSubject<User | null>(null);
  
  // Other components can "watch" this
  public user$ = this.userSubject.asObservable();
  
  // When user logs in
  login(credentials) {
    return this.http.post('/api/auth/login', credentials).pipe(
      tap(user => {
        // Update the "watched" variable
        this.userSubject.next(user);
      })
    );
  }
}
```

---

## 🧩 Components Explained

### What Is a Component?

A component is a piece of UI with its own:
- **Template**: The HTML (what you see)
- **Class**: The TypeScript logic (what it does)
- **Styles**: The CSS (how it looks)

### Component Lifecycle

```typescript
export class ProfileComponent implements OnInit {
  // 1. Constructor runs first (setup dependencies)
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  
  // 2. ngOnInit runs after Angular sets up component
  ngOnInit() {
    // Load initial data here
    this.loadUserProfile();
  }
  
  // 3. User interactions trigger methods
  onFileSelected(event: any) {
    // Handle user actions
  }
}
```

### Data Binding in Templates

```html
<!-- Show data from component -->
<h1>Welcome, {{ user.firstName }}!</h1>

<!-- Two-way binding with forms -->
<input [(ngModel)]="user.email">

<!-- Call component methods -->
<button (click)="saveProfile()">Save</button>

<!-- Conditional display -->
<div *ngIf="isLoggedIn">You're logged in!</div>

<!-- Loop through data -->
<div *ngFor="let laptop of laptops">
  {{ laptop.name }}
</div>
```

---

## 🛠 Services Explained

### What Are Services?

Services are classes that:
- Make HTTP requests to APIs
- Store and share data between components
- Handle business logic

### Dependency Injection

```typescript
// Angular automatically provides services to components
constructor(
  private authService: AuthService,    // Angular creates this
  private userService: UserService,    // Angular creates this
  private http: HttpClient            // Angular creates this
) {
  // No need to manually create these objects!
}
```

### Service Methods Pattern

```typescript
export class UserService {
  // All service methods return Observables
  updateProfile(data: ProfileData): Observable<Response> {
    return this.http.put<Response>('/api/auth/profile', data, {
      withCredentials: true  // Always include for authenticated requests
    });
  }
  
  uploadProfilePicture(file: File): Observable<Response> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Response>('/api/auth/upload-profile-picture', formData, {
      withCredentials: true
    });
  }
}
```

---

## 🔄 How Everything Works Together

### Complete User Flow Example: Profile Picture Upload

1. **User selects file**
```html
<!-- Template -->
<input type="file" (change)="onFileSelected($event)">
```

2. **Component handles selection**
```typescript
// Component
onFileSelected(event: any) {
  const file = event.target.files[0];
  this.selectedFile = file;
}
```

3. **User clicks upload button**
```html
<!-- Template -->
<button (click)="uploadProfilePicture()">Upload</button>
```

4. **Component calls service**
```typescript
// Component
uploadProfilePicture() {
  this.userService.uploadProfilePicture(this.selectedFile).subscribe({
    next: (response) => {
      // Success - update UI
      this.currentProfilePicture = response.profilePicture;
    },
    error: (error) => {
      // Error - show message
      this.snackBar.open('Upload failed', 'Close');
    }
  });
}
```

5. **Service makes API call**
```typescript
// Service
uploadProfilePicture(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return this.http.post('/api/auth/upload-profile-picture', formData, {
    withCredentials: true  // Cookies sent automatically
  });
}
```

6. **Backend processes request** (see backend README)

7. **Response flows back through the chain**

---

## 🔧 Development Tips

### Common Patterns

1. **Always unsubscribe** to prevent memory leaks:
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)  // Auto-unsubscribe when component destroyed
    ).subscribe(data => {
      // Handle data
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

2. **Handle loading states**:
```typescript
export class MyComponent {
  isLoading = false;
  
  loadData() {
    this.isLoading = true;
    this.dataService.getData().subscribe({
      next: (data) => {
        this.isLoading = false;
        // Handle success
      },
      error: (error) => {
        this.isLoading = false;
        // Handle error
      }
    });
  }
}
```

3. **Use Angular Material** for consistent UI:
```typescript
// Import components you need
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
```

---

## 🐛 Common Issues & Solutions

### "Can't resolve Observable"
```typescript
// ❌ Wrong import
import { Observable } from 'rxjs/Observable';

// ✅ Correct import
import { Observable } from 'rxjs';
```

### "withCredentials" not working
```typescript
// Make sure EVERY authenticated request includes this
this.http.get('/api/data', {
  withCredentials: true  // Required for cookies
});
```

### Component data not updating
```typescript
// Make sure you're subscribing to observables
this.dataService.getData().subscribe(data => {
  this.myData = data;  // This updates the component
});
```

---

This README covers the essential concepts for understanding how this Angular application works. Each concept builds on the previous one, so start from the top and work your way down!
