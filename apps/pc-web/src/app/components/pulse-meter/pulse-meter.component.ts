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
  @Input() pulseData!: { fast: number; moderate: number; good: number };

  get total() {
    const { fast, moderate, good } = this.pulseData;
    return fast + moderate + good;
  }
  get fastPerc() {
    const { fast } = this.pulseData;
    return (fast / this.total) * 100;
  }
  get moderatePerc() {
    const { moderate } = this.pulseData;
    return (moderate / this.total) * 100;
  }
  get goodPerc() {
    const { good } = this.pulseData;
    return (good / this.total) * 100;
  }
}
