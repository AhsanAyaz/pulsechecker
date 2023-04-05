import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pulsechecker-emoji-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emoji-bar.component.html',
  styleUrls: ['./emoji-bar.component.scss'],
})
export class EmojiBarComponent {
  emojis = ['👋', '👍', '❤️', '😂', '😲' ,'🎉']
  @Output() emojiSelected = new EventEmitter<string>();

  onEmojiClick(emoji: string): void {
    this.emojiSelected.emit(emoji);
  }
}
