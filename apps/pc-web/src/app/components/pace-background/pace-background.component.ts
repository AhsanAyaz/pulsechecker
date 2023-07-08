import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pace } from '.prisma/client';

@Component({
  selector: 'pulsechecker-pace-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pace-background.component.html',
  styleUrls: ['./pace-background.component.scss'],
})
export class PaceBackgroundComponent {
  @Input() disabled = false;
  @Input() pace: Pace | null = null;
}
