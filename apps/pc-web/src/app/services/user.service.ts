import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { map, mergeMap, Observable, of } from 'rxjs';
import { User as PulseUser } from '@prisma/client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/v1';
  http = inject(HttpClient);
  
  getOrCreateIfNecessary(user: User): Observable<PulseUser> {
    const metadata = user.user_metadata;
    return this.http.get<{user: PulseUser}>(`${this.apiUrl}/users/${user.id}`)
    .pipe(
      mergeMap(({user: pulseUser}) => {
        if (pulseUser) {
          return of({user: pulseUser});
        }
        return this.http.post<{user: PulseUser}>(`${this.apiUrl}/users`, {
          email: metadata['email'],
          id: user.id,
          displayName: metadata['full_name'],
          avatarUrl: metadata['avatar_url'] || '',
          authProvider: user.app_metadata.provider,
          providerId: metadata['provider_id']
        })
      }),
      map(resp => resp.user)
    ); 
  }
}
