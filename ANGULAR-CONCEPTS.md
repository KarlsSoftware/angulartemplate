# Angular Concepts - Beginner Guide

## What is a Service?
A **Service** is like a toolbox that contains reusable functions. It handles:
- API calls to backend
- Data management
- Business logic

**Why use Services?**
- Avoid repeating code
- Keep components clean
- Share data between components

```typescript
@Injectable({
  providedIn: 'root'  // One instance shared everywhere
})
export class ProductsService {
  // Methods to talk to backend
}
```

## What is a Component?
A **Component** is like a building block of your web page. It contains:
- HTML template (what user sees)
- TypeScript logic (what happens)
- CSS styling (how it looks)

```typescript
@Component({
  selector: 'app-products-list',  // HTML tag name
  templateUrl: './template.html',  // What to display
  styleUrl: './styles.css'        // How to style
})
export class ProductsListComponent {
  // Component logic here
}
```

## Data Flow: Delete Example

### Step-by-Step Flow
```
User clicks "Delete" → Component → Service → Backend → Database
                   ↘              ↘        ↘         ↘
                    delete()      delete()  DELETE   Remove data
                   ↗              ↗        ↗         ↗
UI refreshes ← Component ← Service ← Backend ← Database confirms
```

### Detailed Flow

1. **User Action**: Clicks delete button in HTML
   ```html
   <button (click)="delete(laptop.id)">Delete</button>
   ```

2. **Component Method**: Handles the click
   ```typescript
   // products-list.component.ts
   delete(id: number) {
     this.productsService.delete(id).subscribe(() => {
       this.loadProducts(); // Refresh list
     });
   }
   ```

3. **Service Method**: Makes HTTP request
   ```typescript
   // products.service.ts
   delete(id: number) {
     return this.http.delete(`${this.apiUrl}/${id}`);
   }
   ```

4. **Backend API**: Processes request
   ```
   DELETE /api/laptops/5 → Remove laptop with ID 5
   ```

5. **Response Flow**: Success comes back
   ```
   Backend → Service → Component → UI updates
   ```

## Why Two Delete Methods?

| Location | Purpose | Responsibility |
|----------|---------|----------------|
| **Service** | HTTP communication | "How to talk to backend" |
| **Component** | UI interaction | "What to do when user clicks" |

### Service Delete (HTTP Layer)
```typescript
// Just sends request, returns Observable
public delete(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
```

### Component Delete (UI Layer)
```typescript
// Handles user interaction + UI updates
delete(id: number) {
  this.productsService.delete(id).subscribe(() => {
    this.loadProducts(); // Refresh the list
  });
}
```

## Key Angular Concepts

### @Injectable
- Makes a class available for dependency injection
- Angular manages the instance for you
- One service instance shared across the app

### Observable & Subscribe
- **Observable**: Data that comes "later" (like promises)
- **Subscribe**: "Do something when data arrives"
```typescript
this.service.getData().subscribe(data => {
  // Use the data when it arrives
});
```

### HTTP Methods
- `GET` - Read data
- `POST` - Create new data
- `PUT` - Update existing data
- `DELETE` - Remove data

## Environment System
- `environment.ts` - Production settings
- `environment.development.ts` - Development settings
- Angular automatically chooses based on build command:
  - `ng serve` → development
  - `ng build` → production

## Modern Angular Syntax

### New Control Flow (Angular 17+)
```html
@if (laptops) {
  @for (laptop of laptops; track laptop.id) {
    <div>{{laptop.name}}</div>
  }
}
```

### Old Syntax (still valid)
```html
<div *ngIf="laptops">
  <div *ngFor="let laptop of laptops">{{laptop.name}}</div>
</div>
```

## Summary
- **Service** = Backend communication + data management
- **Component** = UI logic + user interactions  
- **Observable** = Async data handling
- **Environment** = Different settings for dev/prod
- **@Injectable** = Makes services available everywhere