import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reactions } from '../interfaces/reactions.interface';

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private apiUrl = 'http://localhost:3000/v1';
  http = inject(HttpClient);

  getReactions(sessionId: number): Observable<Reactions[]> {
    return this.http.get<Reactions[]>(`${this.apiUrl}/reactions-count?sessionId=${sessionId}`);
  }

  addReaction(sessionId: number, reactionType: string, count: number): Observable<Reactions> {
    return this.http.post<Reactions>(`${this.apiUrl}/reactions-count`, {
      sessionId,
      reactionType,
      count
    });
  }
}
