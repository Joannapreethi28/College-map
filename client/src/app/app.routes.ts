import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';

// ROUTING: each path in the browser's URL shows a different component,
// WITHOUT reloading the page. This is what makes our app a Single Page Application.
export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },   // "/" goes to "/map"
  { path: 'map', component: MapComponent },
  { path: 'block/:code', component: MapComponent },     // same map, with one block selected
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },         // route guard added in Phase 7
  { path: '**', redirectTo: 'map' }                     // any unknown URL goes to the map
];
