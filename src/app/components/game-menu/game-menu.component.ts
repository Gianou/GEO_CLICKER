import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [],
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.css'
})
export class GameMenuComponent {
  public regions: string[] = [];
  private _geojsonFileName = "NUTS_switzerland";
  constructor(
    public gameService: GameService
  ) { }

}
