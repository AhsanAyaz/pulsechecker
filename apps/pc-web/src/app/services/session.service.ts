import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../interfaces/session.interface';

type JoinSessionResult = {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:3000/v1';
  http = inject(HttpClient);

  joinSession(meetingId: string, attendeeName: string): Observable<{success: boolean}> {
    return this.http.post<JoinSessionResult>(`${this.apiUrl}/sessions/${meetingId}/join`, {
      attendeeName
    });
  }

  getSession(meetingId: string): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sessions/${meetingId}`);
  }
 
}
