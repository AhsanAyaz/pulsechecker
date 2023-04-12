import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { UserService } from '../services/user.service';
import { Attendee } from '@prisma/client';

@Component({
  selector: 'pulsechecker-join-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join-session.component.html',
  styleUrls: ['./join-session.component.scss'],
})
export class JoinSessionComponent implements OnInit {
  meetingId!: string;
  sessionService = inject(SessionService);
  userService = inject(UserService);
  router = inject(Router);
  supabase = inject(SupabaseService);
  attendee!: Partial<Attendee>;
  ngOnInit(): void {
    this.attendee = this.userService.getAttendeeFromStorage() || {
      displayName: '',
    };
  }

  joinMeeting(): void {
    this.sessionService.joinSession({
      meetingId: this.meetingId, 
      attendee: this.attendee
    }).subscribe((response) => {
      if (response.attendee) {
        this.userService.saveAttendeeToStorage(response.attendee);
        this.router.navigate(['/session', this.meetingId]);
      } else {
        // Handle error or display a message
      }
    });
  }
}
