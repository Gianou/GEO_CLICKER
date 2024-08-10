import { Component } from '@angular/core';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { FindPromptComponent } from './find-prompt/find-prompt.component';
import { GameStartComponent } from './game-start/game-start.component';
import { GameOverComponent } from './game-over/game-over.component';
import { GameService } from '../../services/game.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [NgClass, GameMenuComponent, FindPromptComponent, GameStartComponent, GameOverComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css'
})
export class OverlayComponent {
  constructor(public gameService: GameService) {

  }
}
