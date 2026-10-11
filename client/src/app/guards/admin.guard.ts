import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// A ROUTE GUARD runs BEFORE Angular opens a route and decides if the user may enter.
// Return true -> open the page. Return a URL -> send the user there instead.
//
// A guard is a plain function (not a class), so it has no constructor.
// inject() is how a function asks Angular for a service (dependency injection).
//
// NOTE: this only hides the page. The real protection is requireAdmin on the server,
// because anyone can change things in their own browser.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/login']); // redirect to the login page
};
