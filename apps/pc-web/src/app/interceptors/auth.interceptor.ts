import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { from, mergeMap, Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { environment } from '../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>  => {
  const apiUrl = environment.apiBaseUrl;
  const supabase = inject(SupabaseService);
  return from(supabase.client.auth.getSession())
    .pipe(
      mergeMap(({data: {session}}) => {
        if (!session) {
          return next(request);
        }
        if (request.url.startsWith(`${apiUrl}/users`)) {
          const authReq = request.clone({
            headers: request.headers.set('Authorization', session.access_token),
            withCredentials: true
          });
          return next(authReq);
        }
        return next(request);
      })
    )
}

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private apiUrl = 'http://localhost:3000/v1';
//   supabase = inject(SupabaseService);
//   session!: Session | null;
//   constructor() {
//     this.supabase.client.auth.onAuthStateChange((_, session) => {
//       this.session = session;
//     })
//   }

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     if (!this.session) {
//       return next.handle(request);
//     }
//     if (request.url.startsWith(`${this.apiUrl}/users`)) {
//       request.headers.append('token', this.session.access_token);
//     }
//     return next.handle(request);
//   }
// }
