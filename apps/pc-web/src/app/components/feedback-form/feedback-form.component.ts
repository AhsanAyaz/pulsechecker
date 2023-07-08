import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pace } from '.prisma/client';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'pulsechecker-feedback-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent {
  @Input() submittingFeedback = false;
  pulseForm = new FormGroup({
    pace: new FormControl<Pace | null>(null, { nonNullable: true, validators: [Validators.required] }),
    comment: new FormControl('')
  });
  @Output() formSubmit = new EventEmitter<typeof this.pulseForm.value>();

  submitFeedback(event: SubmitEvent) {
    event.preventDefault();
    this.formSubmit.emit(this.pulseForm.value);
  }
}
