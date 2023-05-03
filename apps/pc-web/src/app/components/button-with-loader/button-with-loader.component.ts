import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'pulsechecker-button-with-loader',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './button-with-loader.component.html',
  styleUrls: ['./button-with-loader.component.scss']
})
export class ButtonWithLoaderComponent {
  @Input() color: 'red' | 'blue' | 'black' = 'black';
  @Input() isLoading = false;
}
