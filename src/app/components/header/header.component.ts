import { Component, effect } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(public gameService: GameService) {
    effect(() => {
      gameService.geoJson();
      console.log('dummy effect is triggered');
    });
  }

  signalTest() {
    console.log('test');
    this.gameService.geoJson.set(this.gameService.geoJson());
  }
}
