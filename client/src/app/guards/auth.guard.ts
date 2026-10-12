import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Like adminGuard, but only checks that SOMEONE is logged in (admin or visitor).
// Used on the map and search pages, so the app starts at the login page.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']); // not logged in -> go to login
};
