import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from '@prisma/client';
import { RouterModule } from '@angular/router';
import { ButtonWithLoaderComponent } from '../button-with-loader/button-with-loader.component';

@Component({
  selector: 'pulsechecker-session-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonWithLoaderComponent],
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss']
})
export class SessionCardComponent {
  @Input() session!: Session;
  @Input() isDeletingSession = false;
  @Output() deleteSession = new EventEmitter<Session>();

  async copyPin(pin: string) {
    await window.navigator.clipboard.writeText(pin);
    alert('Pin copied to clipboard')
  }
  
  async copySessionLink(session: Session) {
    const {pin} = session;
    const url = `${window.location.origin}/session/${pin}`
    await window.navigator.clipboard.writeText(url);
    alert('Session link copied to clipboard')
  }
}
