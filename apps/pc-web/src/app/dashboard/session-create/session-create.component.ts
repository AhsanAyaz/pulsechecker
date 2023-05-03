import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Session } from '@prisma/client';
import { SessionService } from '../../services/session.service';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'pulsechecker-session-create',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.scss'],
})
export class SessionCreateComponent {
  session: Partial<Session>;
  sessionService = inject(SessionService);
  supabase = inject(SupabaseService);
  router = inject(Router);
  creatingSession = false;
  constructor() {
    this.session = this.resetSession();
  }

  async onSubmit() {
    this.creatingSession = true;
    this.sessionService.createSession({
      ...this.session,
      userId: this.supabase.user?.id
    })
      .subscribe({
        next: (session: Session) => {
          console.log('session created', session);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          alert('Error creating session');
        },
        complete: () => {
          this.creatingSession = false;
        }
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
