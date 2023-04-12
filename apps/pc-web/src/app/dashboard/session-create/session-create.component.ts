import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Session } from '@prisma/client';
import { SessionService } from '../../services/session.service';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pulsechecker-session-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.scss'],
})
export class SessionCreateComponent {
  session: Partial<Session>;
  sessionService = inject(SessionService);
  supabase = inject(SupabaseService);
  router = inject(Router);
  constructor() {
    this.session = this.resetSession();
  }

  async onSubmit() {
    this.sessionService.createSession({
      ...this.session,
      userId: this.supabase.user?.id
    })
      .subscribe(session => {
        console.log('session created', session);
        this.router.navigate(['/dashboard']);
      })
  }

  resetSession() {
    return {
      name: '',
      userId: '',
      pin: '',

    } satisfies Partial<Session>
  }
}
