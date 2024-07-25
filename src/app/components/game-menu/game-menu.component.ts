import { Component, effect } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';

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
  ) {
    effect(() => {
      this.gameService.selectedRegions();
      console.log("gamemenu effect triggered");
    });
  }

  handleRegionClick(region: { regionId: string, regionName: string }) {
    this.gameService.addOrRemoveFromSelectedRegions(region);
  }

}
