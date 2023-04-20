import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debounceTime, delay, EMPTY, mergeMap, Observable, of, switchMap, timer } from 'rxjs';
import { Reactions } from '../interfaces/reactions.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private apiUrl = environment.apiBaseUrl;
  http = inject(HttpClient);

  getReactions(sessionId: number): Observable<Reactions[]> {
    return this.http.get<Reactions[]>(`${this.apiUrl}/reactions-count?sessionId=${sessionId}`);
  }

  addReaction(sessionId: number, reactionType: string, count: number): Observable<Reactions> {
    return this.http.post<Reactions>(`${this.apiUrl}/reactions-count`, {
      sessionId,
      reactionType,
      count
    })
  }
}
