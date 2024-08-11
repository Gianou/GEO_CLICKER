import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-guess-history',
  standalone: true,
  imports: [NgClass],
  templateUrl: './guess-history.component.html',
  styleUrl: './guess-history.component.css'
})
export class GuessHistoryComponent {
  constructor(public gameService: GameService) { }
}
