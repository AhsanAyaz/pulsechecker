import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pulsechecker-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() size = 64;
  @HostBinding("style.--bg-color")
  @Input() color = 'rgb(147 51 234)';

  get sizePx(): string {
    return `${this.size}px`;
  }

  get borderWidth(): string {
    return `${this.size/10}px`;
  }
}
