import { Component } from '@angular/core';
import { GameMenuComponent } from '../../components/game-menu/game-menu.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [HeaderComponent, MapComponent, GameMenuComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.css',
})
export class GamePageComponent {}
