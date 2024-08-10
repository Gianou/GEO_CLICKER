import { Component } from '@angular/core';
import { GameMenuComponent } from '../../components/overlay/game-menu/game-menu.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MapComponent } from '../../components/map/map.component';
import { FindPromptComponent } from '../../components/overlay/find-prompt/find-prompt.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [HeaderComponent, MapComponent, GameMenuComponent, FindPromptComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.css',
})
export class GamePageComponent { }
