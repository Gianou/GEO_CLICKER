import { Component } from '@angular/core';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { FindPromptComponent } from './find-prompt/find-prompt.component';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [GameMenuComponent, FindPromptComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css'
})
export class OverlayComponent {
}
