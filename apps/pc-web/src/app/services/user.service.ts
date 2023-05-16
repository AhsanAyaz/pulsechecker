import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { map, mergeMap, Observable, of } from 'rxjs';
import { User as PulseUser, Attendee } from '@prisma/client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl;
  http = inject(HttpClient);
  user!: PulseUser;
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
      map(resp => {
        this.user = resp.user;
        return this.user;
      })
    ); 
  }

  getAttendeeFromStorage(): Attendee | null {
    const attendeeStr = localStorage.getItem('pc-attendee');
    const attendee = attendeeStr ? JSON.parse(attendeeStr) : null;
    return attendee
  }

  getAttendeeFromServer(id: number): Observable<Attendee> {
    return this.http.get<Attendee>(`${this.apiUrl}/attendee/${id}`)
  }

  saveAttendeeToStorage(attendee: Attendee) {
    localStorage.setItem('pc-attendee', JSON.stringify(attendee));
  }
  
  removeAttendeeFromStorage() {
    localStorage.removeItem('pc-attendee');
  }
}
