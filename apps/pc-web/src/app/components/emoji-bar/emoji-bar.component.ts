import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, AnimationBuilder } from '@angular/animations';

@Component({
  selector: 'pulsechecker-emoji-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emoji-bar.component.html',
  styleUrls: ['./emoji-bar.component.scss'],
  animations: [
    trigger('emojiState', [
      state('idle', style({ transform: 'translateY(0)' })),
      state('flying', style({ transform: 'translateY(-100px)', opacity: 0 })),
      transition('idle => flying', [animate('400ms ease-out')]),
    ]),
  ]
})
export class EmojiBarComponent {
  emojis = ['👋', '👍', '❤️', '😂', '😲' ,'🎉']
  @Output() emojiSelected = new EventEmitter<string>();

  constructor(private renderer: Renderer2, private el: ElementRef, private builder: AnimationBuilder) {}


  onEmojiClick(emoji: string, event: MouseEvent): void {
    this.emojiSelected.emit(emoji);
    const flyingEmoji = this.renderer.createElement('span');
    this.renderer.addClass(flyingEmoji, 'flying-emoji');
    this.renderer.setStyle(flyingEmoji, 'left', event.clientX + 'px');
    this.renderer.setStyle(flyingEmoji, 'bottom', '20px');
    this.renderer.setProperty(flyingEmoji, 'innerText', emoji);
    this.renderer.appendChild(this.el.nativeElement, flyingEmoji);

    const animation = this.builder.build([
      animate('800ms ease-out', style({ transform: 'translateY(-100px)', opacity: 0 })),
    ]);

    const player = animation.create(flyingEmoji);
    player.play();

    player.onDone(() => {
      this.renderer.removeChild(this.el.nativeElement, flyingEmoji);
    });
  }
}
