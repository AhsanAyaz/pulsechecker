import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Feedback, Pace } from '@prisma/client';
import { SessionFeedbackWithCount } from '../interfaces/session-feedback.interface';
import { map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = environment.apiBaseUrl;
  http = inject(HttpClient);

  saveFeedback(sessionId: number, pace: string, attendeeId: number): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/sessions/${sessionId}/feedback`, {
      feedback: {
        pace,
        attendeeId,
        sessionId
      }
    })
  }

  getAttendeeFeedback(sessionId: number, attendeeId: number): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/sessions/${sessionId}/feedback/${attendeeId}`)
  }

  getSessionFeedbackCounts(sessionId: number): Observable<SessionFeedbackWithCount> {
    return this.http.get<{
      "_count": {
        "pace": number
      },
      "pace": Pace
    }[]>(`${this.apiUrl}/sessions/${sessionId}/feedback`).pipe(
      map(resp => {
        return resp.reduce((acc, next) => {
          return {
            ...acc,
            [next.pace]: next._count.pace
          }
        }, {} as SessionFeedbackWithCount)
      })
    )
  }
}
