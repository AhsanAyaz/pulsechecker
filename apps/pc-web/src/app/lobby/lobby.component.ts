import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pulsechecker-lobby',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  attendees = [
    { name: 'John Doe' },
    { name: 'Jane Smith' },
    { name: 'Alice' },
    { name: 'Bob' },
    // Add more attendees as needed
  ];
}
