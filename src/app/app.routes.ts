import { Routes } from '@angular/router';
import { LinksComponent } from './links/links.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import { ProductsEditComponent } from './products/product-edit/product-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: ProductsListComponent, canActivate: [authGuard] },
  { path: 'links', component: LinksComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductsListComponent, canActivate: [authGuard] },
  { path: 'products/create', component: ProductsCreateComponent, canActivate: [authGuard] },
  { path: 'products/edit/:id', component: ProductsEditComponent, canActivate: [authGuard] },
];
