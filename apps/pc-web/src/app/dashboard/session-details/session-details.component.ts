import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { SessionFeedbackWithCount } from '../../interfaces/session-feedback.interface';
import { PulseMeterComponent } from '../../components/pulse-meter/pulse-meter.component';
import { ReactionsService } from '../../services/reactions.service';
import { Reactions } from '../../interfaces/reactions.interface';
import { SessionService } from '../../services/session.service';
import { SessionWithFeedback } from '../../interfaces/session.interface';
import { LegendPosition, PieChartModule } from '@swimlane/ngx-charts';
import { Pace } from '@prisma/client';
import { SupabaseService } from '../../services/supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';

@Component({
  selector: 'pulsechecker-session-details',
  standalone: true,
  imports: [CommonModule, RouterModule, PulseMeterComponent, PieChartModule],
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  feedbackService = inject(FeedbackService);
  rcService = inject(ReactionsService);
  sessionService = inject(SessionService);
  supabase = inject(SupabaseService);
  feedbacksCounts: SessionFeedbackWithCount = {
    fast: 0,
    moderate: 0,
    good: 0
  }
  legendPosition: LegendPosition = LegendPosition.Below
  feedbacksCountsArr: {name: string, value: number}[] = [];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  customColors = [{
    name: 'fast',
    value: 'red'
  }, {
    name: 'moderate',
    value: 'yellow'
  }, {
    name: 'good',
    value: 'green'
  }]
  realtimeChannel!: RealtimeChannel;
  session!: SessionWithFeedback;
  reactions!: Reactions[];
  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (!sessionId) {
      return;
    }

    this.sessionService.getSession(sessionId, true).subscribe(session => {
      console.log(session)
      this.session = session as SessionWithFeedback;
      this.initHandlers();
    })
    this.feedbackService.getSessionFeedbackCounts(Number(sessionId))
      .subscribe(feedbacks => {
        console.log({feedbacks})
        this.feedbacksCounts = {
          ...this.feedbacksCounts,
          ...feedbacks
        }
        this.feedbacksCountsArr = Object.keys(this.feedbacksCounts).map(key => {
          return {
            name: key,
            value: this.feedbacksCounts[key as Pace]
          }
        })
      })
    this.rcService.getReactions(Number(sessionId))
      .subscribe((reactions) => {
        console.log({reactions})
        this.reactions = reactions;
      })
    
  }

  initHandlers() {
    this.realtimeChannel = this.supabase.client.channel(`session_${this.session.id}`);
    this.realtimeChannel
    .on('broadcast', { event: 'pulse-added' }, (payload) => {
      console.log('added', payload)
      const { pace, attendee, attendeeId } = payload;
      this.feedbacksCountsArr = this.feedbacksCountsArr.map(countObj => {
        if (countObj.name === pace) {
          return {
            ...countObj,
            value: countObj.value + 1
          }
        }
        return countObj
      })
      this.session.Feedback.push({
        pace,
        attendee,
        attendeeId,
        sessionId: this.session.id
      })
    })
    .on('broadcast', { event: 'pulse-updated' }, (payload) => {
      console.log('updated', payload)
      const { pace, paceFrom, attendee } = payload;
      this.feedbacksCountsArr = this.feedbacksCountsArr.map(countObj => {
        if (countObj.name === pace) {
          return {
            ...countObj,
            value: countObj.value + 1
          }
        } else if (countObj.name === paceFrom) {
          return {
            ...countObj,
            value: countObj.value - 1
          }
        }
        return countObj;
      })
      this.session.Feedback = this.session.Feedback.map(feedback => {
        if (feedback.attendeeId === attendee.id && feedback.sessionId === this.session.id) {
          return {
            ...feedback,
            pace,
          }
        }
        return feedback;
      })
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('YEAH!');
      }
    })
  }
}
