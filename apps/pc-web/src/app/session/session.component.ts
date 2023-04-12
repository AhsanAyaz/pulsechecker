import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseMeterComponent } from '../components/pulse-meter/pulse-meter.component';
import { EmojiBarComponent } from '../components/emoji-bar/emoji-bar.component';
import { SessionService } from '../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  filter,
  mergeMap,
  takeWhile,
} from 'rxjs';
import { ReactionsService } from '../services/reactions.service';
import { Reactions } from '../interfaces/reactions.interface';
import { Attendee, Feedback, Session } from '@prisma/client';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { UserService } from '../services/user.service';

type PulseType = 'fast' | 'moderate' | 'good';

@Component({
  selector: 'pulsechecker-session',
  standalone: true,
  imports: [
    CommonModule,
    PulseMeterComponent,
    EmojiBarComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit, OnDestroy {
  colors: PulseType[] = ['fast', 'moderate', 'good'];
  pulseData: Record<PulseType, number> = { fast: 1, moderate: 1, good: 1 };
  selectedPulse: PulseType | null = null;
  sessionService = inject(SessionService);
  reactionsService = inject(ReactionsService);
  feedbackService = inject(FeedbackService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  session!: Session;
  reactions!: Reactions[];
  emojiTap: BehaviorSubject<{ count: number; emoji: string }> =
    new BehaviorSubject({
      emoji: '',
      count: 0,
    });
  pulseForm = new FormGroup({
    pulse: new FormControl<PulseType | null>(null, { nonNullable: true }),
  });
  componentAlive = true;
  attendee!: Attendee | null;

  ngOnInit(): void {
    this.componentAlive = true;
    const pin = this.route.snapshot.paramMap.get('id');
    this.attendee = this.userService.getAttendeeFromStorage();
    if (!pin || !this.attendee) {
      this.router.navigate(['/']);
      return;
    }
    this.sessionService
      .getSessionByPin(pin)
      .pipe(
        mergeMap((session: Session) => {
          this.session = session;
          return this.getFeedback(this.attendee as Attendee);
        }),
        catchError(({ error }) => {
          console.error(error);
          if (error.statusCode === 404) {
            this.router.navigate(['/404']);
          }
          throw error;
        })
      )
      .subscribe((feedback: Feedback) => {
        if (feedback) {
          this.pulseForm.controls.pulse.setValue(feedback.pace);
          this.pulseData[feedback.pace]++;
          this.selectedPulse = feedback.pace;
        }
        this.initHandlers()
      });
  }

  initHandlers() {
    this.emojiTap
      .pipe(
        debounceTime(500),
        filter((val) => !!val.emoji),
        takeWhile(() => this.componentAlive)
      )
      .subscribe((val) => {
        this.saveReaction(val.emoji, val.count);
      });

    this.pulseForm.valueChanges
      .pipe(
        debounceTime(500),
        filter((val) => !!val.pulse),
        takeWhile(() => this.componentAlive)
      )
      .subscribe((val) => {
        if (!val.pulse) {
          return;
        }
        this.onPaceButtonClick(val.pulse);
      });
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
  }

  onPaceButtonClick(color: PulseType): void {
    if (this.selectedPulse !== null && this.selectedPulse !== color) {
      this.pulseData[this.selectedPulse]--;
    } else if (this.selectedPulse === color) {
      return;
    }
    this.selectedPulse = color;
    this.pulseData[color]++;
    this.saveFeedback(this.selectedPulse);
  }

  onEmojiTapped(emoji: string): void {
    const prevVal = this.emojiTap.getValue();
    this.emojiTap.next({
      emoji,
      count: prevVal.emoji !== emoji ? 1 : this.emojiTap.getValue().count + 1,
    });
  }

  saveReaction(emoji: string, count: number) {
    this.reactionsService
      .addReaction(this.session.id, emoji, count)
      .subscribe((reactions) => {
        console.log(reactions);
      });
  }

  saveFeedback(pulse: PulseType) {
    if (!this.attendee) {
      return;
    }
    this.feedbackService
      .saveFeedback(this.session.id, pulse as string, this.attendee.id)
      .subscribe((result) => {
        console.log({ result });
      });
  }

  getFeedback(attendee: Attendee) {
    return this.feedbackService.getFeedback(this.session.id, attendee.id);
  }
}
