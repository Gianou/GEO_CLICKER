import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { GameState } from '../../../services/gameState.enum';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.css'
})
export class GameOverComponent {
  constructor(public gameService: GameService) { }
  newGame() {
    this.gameService.gameState.set(GameState.Setup);
  }
}
