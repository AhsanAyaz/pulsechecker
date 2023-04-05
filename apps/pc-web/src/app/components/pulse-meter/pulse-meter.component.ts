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
  @Input() pulseData!: { red: number; yellow: number; green: number };

  get total() {
    const { red, yellow, green } = this.pulseData;
    return red + yellow + green;
  }
  get redPerc() {
    const { red } = this.pulseData;
    return (red / this.total) * 100;
  }
  get yellowPerc() {
    const { yellow } = this.pulseData;
    return (yellow / this.total) * 100;
  }
  get greenPerc() {
    const { green } = this.pulseData;
    return (green / this.total) * 100;
  }
}
