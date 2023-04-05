import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'pulsechecker-join-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join-session.component.html',
  styleUrls: ['./join-session.component.scss'],
})
export class JoinSessionComponent {
  meetingId!: string;
  attendeeName!: string;
  sessionService = inject(SessionService);
  router = inject(Router);
  supabase = inject(SupabaseService);

  joinMeeting(): void {
    this.sessionService.joinSession(this.meetingId, this.attendeeName).subscribe((response) => {
      if (response.success) {
        this.router.navigate(['/session', this.meetingId]);
      } else {
        // Handle error or display a message
      }
    });
  }
}
