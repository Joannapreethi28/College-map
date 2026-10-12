import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

// ROUTING: each path in the browser's URL shows a different component,
// WITHOUT reloading the page. This is what makes our app a Single Page Application.
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },   // the app opens at the login page
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // These need a logged-in user (authGuard sends everyone else to /login)
  { path: 'map', component: MapComponent, canActivate: [authGuard] },
  { path: 'block/:code', component: MapComponent, canActivate: [authGuard] },   // same map, one block selected
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },

  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },     // admins only
  { path: '**', redirectTo: 'login' }                                          // any unknown URL
];
