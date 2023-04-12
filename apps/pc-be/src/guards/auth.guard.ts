import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { createClient } from '@supabase/supabase-js';

const client = createClient("https://gflvvytymdmrbjpmymhb.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbHZ2eXR5bWRtcmJqcG15bWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAyNTIwMjIsImV4cCI6MTk5NTgyODAyMn0.1m-3IhFB-87AKk_-UIPzB0O1URgBwl78oKu8sNe8aFU")

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const {authorization} = request.headers;
    if (!authorization) {
      throw new UnauthorizedException();
    }
    return client.auth.getUser(authorization).then(({data: {user}}) => {
      if (user) {
        request.user = user;
      }
      return !!user;  
    });
  }
}
