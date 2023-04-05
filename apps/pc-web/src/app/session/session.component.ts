import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseMeterComponent } from '../components/pulse-meter/pulse-meter.component';
import { EmojiBarComponent } from '../components/emoji-bar/emoji-bar.component';
import { SessionService } from '../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../interfaces/session.interface';
import { catchError, mergeMap } from 'rxjs';
import { ReactionsService } from '../services/reactions.service';
import { Reactions } from '../interfaces/reactions.interface';

type PulseType = 'red' | 'yellow' | 'green';

@Component({
  selector: 'pulsechecker-session',
  standalone: true,
  imports: [CommonModule, PulseMeterComponent, EmojiBarComponent],
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  colors: PulseType[] = ['red', 'yellow', 'green'];
  pulseData: Record<PulseType, number> = { red: 1, yellow: 2, green: 1 };
  selectedPulse: PulseType | null = null;
  sessionService = inject(SessionService);
  reactionsService = inject(ReactionsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session!: Session;
  reactions!: Reactions[];
  ngOnInit(): void {
    const meetingId = this.route.snapshot.paramMap.get('id');
    this.sessionService.getSession(meetingId!)
      .pipe(
        mergeMap((session: Session) => {
          console.log(session)
          this.session = session;
          return this.reactionsService.getReactions(Number(meetingId));
        }),
        catchError(({error}) => {
          console.error(error)
          if (error.statusCode === 404) {
            this.router.navigate(['/404'])
          }
          throw error;
        })
      ).subscribe((reactions: Reactions[]) => {
      console.log(reactions)
      this.reactions = reactions;
    })
  }

  onPaceButtonClick(color: PulseType): void {
    if (this.selectedPulse !== null && this.selectedPulse !== color) {
      this.pulseData[this.selectedPulse]--;  
    } else if (this.selectedPulse === color) {
      return;
    }
    this.selectedPulse = color;
    this.pulseData[color]++;
    // Send updated pulse data to the server or broadcast via a real-time data source
    console.log({pulseData: this.pulseData, selectedPulse: this.selectedPulse})
  }

  onEmojiSelected(emoji: string): void {
    console.log('Emoji selected:', emoji);
    this.reactionsService.addReaction(this.session.id, emoji, 1).subscribe(reactions => {
      console.log(reactions);
    });
    // Send the selected emoji as a reaction to the server or broadcast via a real-time data source
  }
}
