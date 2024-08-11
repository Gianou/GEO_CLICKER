import { Component, effect } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [NgClass, MatSelectModule],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.css'
})
export class GameStartComponent {
  constructor(public gameService: GameService) {
    effect(() => {
      console.log(this.gameService.countries());
    });
  }

  onSelectCountry(country: any) {
    console.log(country);
    this.gameService.selectedCountry.set(country);
  }
}
