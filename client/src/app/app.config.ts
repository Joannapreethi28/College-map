import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// App-wide settings. "providers" are the services Angular makes available everywhere.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Uses zone.js so the screen updates automatically whenever our data changes
    // (for example, when the blocks arrive from the server)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Turns on Angular's routing with the routes from app.routes.ts
    provideRouter(routes),

    // Makes HttpClient available so services can call our Express API
    provideHttpClient()
  ]
};
