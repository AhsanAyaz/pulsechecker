import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feedback, Session } from '@prisma/client';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'tw-elements';

@Component({
  selector: 'pulsechecker-feedback-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit, OnChanges {
  @Input() session!: Session;
  @Input() feedback!: Feedback;
  @ViewChild('modalEl') modalEl!: ElementRef<HTMLElement>;
  @Output() feedbackSubmit = new EventEmitter<string | null>();
  feedbackForm = new FormGroup({
    feedback: new FormControl('', {
      nonNullable: false,
    })
  })

  ngOnInit(): void {
    this.feedbackForm.controls.feedback.setValue(this.feedback.comment);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['feedback'].firstChange && changes['feedback'].previousValue !== changes['feedback'].currentValue) {
      this.feedbackForm.controls.feedback.setValue(changes['feedback'].currentValue.comment);
    }
  }

  modalClosed() {
    this.feedbackSubmit.emit(null);
  }

  formSubmit(form: FormGroup, $event: SubmitEvent) {
    $event.preventDefault();
    Modal.getInstance(this.modalEl.nativeElement).hide();
    this.feedbackSubmit.emit(form.value.feedback);
  }
}
