import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Feedback } from '@prisma/client';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:3000/v1';
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

  getFeedback(sessionId: number, attendeeId: number): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/sessions/${sessionId}/feedback/${attendeeId}`)
  }
}
