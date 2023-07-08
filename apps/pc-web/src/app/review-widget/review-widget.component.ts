import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackFormComponent } from '../components/feedback-form/feedback-form.component';
import { Pace } from '.prisma/client';
import { PaceBackgroundComponent } from '../components/pace-background/pace-background.component';

@Component({
  selector: 'pulsechecker-review-widget',
  standalone: true,
  imports: [CommonModule, FeedbackFormComponent, PaceBackgroundComponent],
  templateUrl: './review-widget.component.html',
  styleUrls: ['./review-widget.component.scss'],
})
export class ReviewWidgetComponent {
  @ViewChild(FeedbackFormComponent) feedbackForm!: FeedbackFormComponent;
  submittingFeedback = false;
  backgroundDisabled = true;
  submitFeedback(form: Partial<{
    pace: Pace | null,
    comment: string | null
  }>) {
    console.log(form);
  }

  get pace() {
    return this.feedbackForm ? this.feedbackForm.pulseForm.controls.pace.value : null;
  }
}
