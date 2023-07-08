import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseMeterComponent } from '../components/pulse-meter/pulse-meter.component';
import { EmojiBarComponent } from '../components/emoji-bar/emoji-bar.component';
import { SessionService } from '../services/session.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  debounceTime,
  filter,
  forkJoin,
  mergeMap,
  takeWhile,
} from 'rxjs';
import { ReactionsService } from '../services/reactions.service';
import { Reactions } from '../interfaces/reactions.interface';
import { Attendee, Feedback, Pace, Session } from '@prisma/client';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { UserService } from '../services/user.service';
import { SupabaseService } from '../services/supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SessionFeedbackWithCount } from '../interfaces/session-feedback.interface';
import { LoaderComponent } from '../components/loader/loader.component';
import { Title } from '@angular/platform-browser';
import { Modal, initTE, Input } from 'tw-elements';
import { WalkthroughService } from '../services/walkthrough.service';
import { FeedbackFormComponent } from '../components/feedback-form/feedback-form.component';
import { PaceBackgroundComponent } from '../components/pace-background/pace-background.component';

@Component({
  selector: 'pulsechecker-session',
  standalone: true,
  imports: [
    CommonModule,
    PulseMeterComponent,
    EmojiBarComponent,
    ReactiveFormsModule,
    LoaderComponent,
    FeedbackFormComponent,
    PaceBackgroundComponent,
    RouterModule,
  ],
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit, OnDestroy {
  colors: Pace[] = [Pace.slow, Pace.good, Pace.fast];
  feedbacks: SessionFeedbackWithCount = { fast: 0, slow: 0, good: 0 };
  walkthroughService = inject(WalkthroughService);
  sessionService = inject(SessionService);
  reactionsService = inject(ReactionsService);
  feedbackService = inject(FeedbackService);
  supabase = inject(SupabaseService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  titleService = inject(Title);
  session!: Session;
  reactions!: Reactions[];
  emojiTap: BehaviorSubject<{ count: number; emoji: string }> =
    new BehaviorSubject({
      emoji: '',
      count: 0,
    });
  componentAlive = true;
  attendee!: Attendee | null;
  realtimeChannel!: RealtimeChannel;
  isLoadingData = false;
  sendingFeedback = true;
  attendeeFeedback: Feedback | null = null;
  submittingFeedback = false;
  @ViewChild(FeedbackFormComponent)
  feedbackForm!: FeedbackFormComponent;

  get pace() {
    return this.feedbackForm ? this.feedbackForm.pulseForm.controls.pace.value : null;
  }

  feedbackCommentTriggerClick() {
    if (this.walkthroughService.isActive()) {
      this.walkthroughService.stop()
    }
  }

  ngOnInit(): void {
    initTE({Modal, Input})
    this.componentAlive = true;
    const pin = this.route.snapshot.paramMap.get('id');
    this.attendee = this.userService.getAttendeeFromStorage();
    if (!pin || !this.attendee) {
      this.router.navigateByUrl(`/join?session=${pin}`);
      return;
    }
    this.isLoadingData = true;
    this.userService.getAttendeeFromServer(this.attendee.id)
      .pipe(
        mergeMap(attendee => {
          if (!attendee) {
            this.userService.removeAttendeeFromStorage();
            this.router.navigateByUrl(`/join?session=${pin}`);
            return EMPTY;
          }
          this.userService.saveAttendeeToStorage(attendee);
          this.attendee = attendee;
          return this.sessionService.getSessionByPin(pin);
        }),
        catchError(({ error }) => {
          console.error(error);
          if (error.statusCode === 404) {
            this.router.navigate(['/404']);
          }
          this.isLoadingData = false;
          throw error;
        }),
        mergeMap((session) => {
          this.session = session;
          this.titleService.setTitle(this.session.name);
          return forkJoin([
            this.feedbackService.getAttendeeFeedback(this.session.id, (this.attendee as Attendee).id),
            this.feedbackService.getSessionFeedbackCounts(this.session.id),
          ]);
        }),
      )
      .subscribe(([attendeeFeedback, feedbacks]: [Feedback, SessionFeedbackWithCount]) => {
        console.log({feedbacks})
        this.feedbacks = {
          ...this.feedbacks,
          ...feedbacks
        };
        
        if (attendeeFeedback) {
          this.feedbackForm.pulseForm.controls.pace.setValue(attendeeFeedback.pace);
          this.feedbackForm.pulseForm.controls.comment.setValue(attendeeFeedback.comment);
          this.attendeeFeedback = attendeeFeedback;
        } else {
          this.feedbackForm.pulseForm.controls.pace.setValue(null);
          this.onPaceButtonClick(Pace.good);
          this.attendeeFeedback = {
            pace: null as unknown as Pace,
            comment: '',
            attendeeId: this.attendee?.id as number,
            sessionId: this.session.id
          };
        }
        this.initHandlers()
        this.isLoadingData = false;
        this.walkthroughService.start();
      });
  }

  initHandlers() {
    console.log('init handlers')
    this.emojiTap
      .pipe(
        debounceTime(500),
        filter((val) => !!val.emoji),
        takeWhile(() => this.componentAlive)
      )
      .subscribe((val) => {
        this.saveReaction(val.emoji, val.count);
      });

    this.realtimeChannel = this.supabase.client.channel(`session_${this.session.id}`);
    this.realtimeChannel
    .on('broadcast', { event: 'pulse-added' }, (payload) => {
      console.log('added', payload)
      const { pace } = payload;
      this.feedbacks[pace as Pace]++;
    })
    .on('broadcast', { event: 'pulse-updated' }, (payload) => {
      console.log('updated', payload)
      const { pace, paceFrom } = payload;
      this.feedbacks[pace as Pace]++;
      this.feedbacks[paceFrom as Pace]--;
      console.log(this.feedbacks)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    .subscribe((_) => {})
  }

  submitFeedback(form: Partial<{
    pace: Pace | null,
    comment: string | null
  }>) {
    const { pace, comment } = form;
    if (!pace || !this.attendeeFeedback) {
      return;
    }
    let updateFrom: Pace | null = null;
    if (!!this.attendeeFeedback.pace && this.attendeeFeedback.pace !== pace) {
      updateFrom = this.attendeeFeedback.pace;
      this.feedbacks[this.attendeeFeedback.pace]--;
    } else if (this.attendeeFeedback.pace === pace) {
      this.feedbackForm.pulseForm.controls.pace.enable({
        emitEvent: false
      });
    }
    this.attendeeFeedback.pace = pace;
    this.attendeeFeedback.comment = comment || '';
    this.feedbacks[pace]++;
    this.saveFeedback(this.attendeeFeedback, updateFrom);
  }

  feedbackCommentSubmit(comment: string | null) {
    if (comment === null || !this.attendeeFeedback) {
      return;
    }
    this.attendeeFeedback.comment = comment;
    this.saveFeedback(this.attendeeFeedback, null);
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
  }

  onPaceButtonClick(pace: Pace): void {
    let updateFrom: Pace | null = null;
    if (!this.attendeeFeedback) {
      return;
    }
    if (!!this.attendeeFeedback.pace && this.attendeeFeedback.pace !== pace) {
      updateFrom = this.attendeeFeedback.pace;
      this.feedbacks[this.attendeeFeedback.pace]--;
    } else if (this.attendeeFeedback.pace === pace) {
      this.feedbackForm.pulseForm.controls.pace.enable({
        emitEvent: false
      });
      return;
    }
    this.attendeeFeedback.pace = pace;
    this.feedbacks[pace]++;
    this.saveFeedback(this.attendeeFeedback, updateFrom);
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

  saveFeedback(feedback: Pick<Feedback, 'pace' | 'comment'>, updateFrom: Pace | null) {
    if (!this.attendee || !this.attendeeFeedback) {
      return;
    }
    const feedbackParams: Omit<Feedback, 'id'> = {
      sessionId: this.session.id,
      pace: feedback.pace || this.attendeeFeedback.pace || Pace.good,
      attendeeId: this.attendee.id,
      comment: feedback.comment || this.attendeeFeedback.comment || ''
    }
    
    this.submittingFeedback = true;
    this.feedbackService
      .saveFeedback(feedbackParams)
      .subscribe({
        next: (result) => {
          this.attendeeFeedback = result;
          this.realtimeChannel
          .send({
            type: 'broadcast',
            event: updateFrom !== null ? 'pulse-updated' : 'pulse-added',
            pace: result.pace,
            paceFrom: updateFrom,
            sessionId: this.session.id,
            attendeeId: this.attendee?.id,
            attendee: this.attendee
          })
          alert('Feedback submitted');
        }, error: () => {
            if (updateFrom === null || !this.attendeeFeedback) {
              return;
            }
            if (this.attendeeFeedback.pace) {
              this.feedbacks[this.attendeeFeedback.pace]--;
            }
            this.feedbacks[updateFrom as Pace]++;
            this.attendeeFeedback.pace = updateFrom;
            this.feedbackForm.pulseForm.controls.pace.setValue(this.attendeeFeedback.pace, {
              emitEvent: false
            })
            this.feedbackForm.pulseForm.controls.pace.enable({
              emitEvent: false
            });
        }, complete: () => {
          this.submittingFeedback = false;
          this.feedbackForm.pulseForm.controls.pace.enable({
            emitEvent: false
          });
        }
      });
  }
}
