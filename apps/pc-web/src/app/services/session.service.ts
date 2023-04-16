import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Attendee, Session } from '@prisma/client';
import { Observable } from 'rxjs';
import { SessionWithFeedback } from '../interfaces/session.interface';

type JoinSessionResult = {
  session: Session,
  attendee: Attendee
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:3000/v1';
  http = inject(HttpClient);

  joinSession({meetingId, attendee}: {meetingId: string, attendee: Partial<Attendee>}): Observable<JoinSessionResult> {
    return this.http.post<JoinSessionResult>(`${this.apiUrl}/sessions/${meetingId}/join`, {attendee});
  }

  getSession(meetingId: string, withFeedback = false): Observable<Session | SessionWithFeedback> {
    let url = `${this.apiUrl}/sessions/${meetingId}`;
    if (withFeedback) {
      url += '?withFeedback=true';
    }
    return this.http.get<Session>(url);
  }

  getSessionByPin(pin: string): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sessions/by-pin/${pin}`);
  }

  getUserSessions(userId: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/users/${userId}/sessions`);
  }

  createSession(session: Partial<Session>): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/users/${session.userId}/sessions`, {
      ...session
    });
  }

  deleteUserSession(sessionId: number, userId: string): Observable<Session> {
    return this.http.delete<Session>(`${this.apiUrl}/users/${userId}/sessions/${sessionId}`);
  }
 
}
