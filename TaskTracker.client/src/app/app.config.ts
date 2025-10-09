import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter(routes), provideClientHydration(withEventReplay()),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(MatSnackBarModule),
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(MatNativeDateModule),
  ]
};
