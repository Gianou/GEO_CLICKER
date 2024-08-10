import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-find-prompt',
  standalone: true,
  imports: [],
  templateUrl: './find-prompt.component.html',
  styleUrl: './find-prompt.component.css'
})
export class FindPromptComponent {
  constructor(public gameService: GameService) {
  }

}
