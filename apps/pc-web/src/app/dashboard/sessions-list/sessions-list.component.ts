import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { Session } from '@prisma/client';
import { SupabaseService } from '../../services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pulsechecker-sessions-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
})
export class SessionsListComponent implements OnInit {
  sessionService = inject(SessionService);
  userService = inject(UserService);
  supabase = inject(SupabaseService);
  sessions!: Session[];
  ngOnInit() {
    this.getSessionsList();
  }

  async getSessionsList() {
    const {
      data: { user },
    } = await this.supabase.client.auth.getUser();
    if (!user) {
      return;
    }
    this.sessionService.getUserSessions(user.id).subscribe((sessions) => {
      this.sessions = sessions;
    });
  }

  deleteSession(session: Session) {
    const confirmDelete = confirm(
      `Are you sure you want to delete the session: ${session.name}?`
    );
    if (!confirmDelete) {
      return;
    }
    this.sessionService
      .deleteUserSession(session.id, this.userService.user.id)
      .subscribe((session) => {
        this.sessions = this.sessions.filter((sess) => sess.id !== session.id);
      });
  }
}
