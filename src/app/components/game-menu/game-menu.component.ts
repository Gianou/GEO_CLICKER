import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [],
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.css'
})
export class GameMenuComponent {
  constructor(
    public gameService: GameService
  ) { }

  handleRegionClick(regionName: string) {
    this.gameService.addOrRemoveFromSelectedRegions(regionName);
  }

}
