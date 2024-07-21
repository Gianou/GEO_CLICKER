import { Component } from '@angular/core';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  //standalone: true,
  //imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GeoClicker';
  constructor(private gameService: GameService) { }
  ngOnInit() {
    this.gameService.loadGeoJSON();
  }
}
