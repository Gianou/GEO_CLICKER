import { Component, effect } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [NgClass, GameMenuComponent],
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.css'
})
export class GameMenuComponent {
  constructor(
    public gameService: GameService
  ) {
  }

}
