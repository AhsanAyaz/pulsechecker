import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { Session } from '@prisma/client';
import { SupabaseService } from '../../services/supabase.service';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';
import { SessionCardComponent } from '../../components/session-card/session-card.component';

@Component({
  selector: 'pulsechecker-sessions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, SessionCardComponent],
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
})
export class SessionsListComponent implements OnInit {
  sessionService = inject(SessionService);
  userService = inject(UserService);
  supabase = inject(SupabaseService);
  sessions!: Session[];
  loadingSessions = false;
  sessionDeletion: {
    isDeleting: boolean,
    sessionId: number | null
  }  = {
    isDeleting: false,
    sessionId: null
  };
  ngOnInit() {
    this.getSessionsList();
  }

  async getSessionsList() {
    this.loadingSessions = true;
    const {
      data: { user },
    } = await this.supabase.client.auth.getUser();
    if (!user) {
      this.loadingSessions = false;
      return;
    }
    this.sessionService.getUserSessions(user.id).subscribe((sessions) => {
      this.sessions = sessions;
      this.loadingSessions = false;
    });
  }

  deleteSession(session: Session) {
    this.sessionDeletion = {
      isDeleting: true,
      sessionId: session.id
    };
    const confirmDelete = confirm(
      `Are you sure you want to delete the session: ${session.name}?`
    );
    if (!confirmDelete) {
      this.resetSessionDeletion();
      return;
    }
    this.sessionService
      .deleteUserSession(session.id, this.userService.user.id)
      .subscribe({
        next: (session) => {
          this.sessions = this.sessions.filter((sess) => sess.id !== session.id);
        },
        complete: () => {
          this.resetSessionDeletion();
        }
      });
  }

  resetSessionDeletion() {
    this.sessionDeletion = {
      isDeleting: false,
      sessionId: null
    };
  }
}
