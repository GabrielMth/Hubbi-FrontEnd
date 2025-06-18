import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEnvironmentNgxCurrency, NgxCurrencyInputMode } from 'ngx-currency';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { authInterceptor } from './auth.interceptor';

import { routes } from './app.routes';

import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.p-dark' },
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEnvironmentNgxCurrency({
      align: 'right',
      allowNegative: false,
      allowZero: true,
      decimal: ',',
      precision: 2,
      prefix: 'R$ ',
      suffix: '',
      thousands: '.',
      nullable: true,
      inputMode: NgxCurrencyInputMode.Financial
    }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    AuthGuard,
  ],
};
