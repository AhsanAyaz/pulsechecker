import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation(), withHashLocation()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
