import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pulsechecker-pulse-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pulse-meter.component.html',
  styleUrls: ['./pulse-meter.component.scss'],
})
export class PulseMeterComponent {
  @Input() pulseData!: { fast: number; slow: number; good: number };

  get total() {
    const { fast, slow, good } = this.pulseData;
    return fast + slow + good;
  }
  get fastPerc() {
    const { fast } = this.pulseData;
    return (fast / this.total) * 100;
  }
  get moderatePerc() {
    const { slow } = this.pulseData;
    return (slow / this.total) * 100;
  }
  get goodPerc() {
    const { good } = this.pulseData;
    return (good / this.total) * 100;
  }
}
