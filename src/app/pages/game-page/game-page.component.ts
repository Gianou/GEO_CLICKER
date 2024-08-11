import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { OverlayComponent } from '../../components/overlay/overlay.component';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [HeaderComponent, MapComponent, OverlayComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.css',
})
export class GamePageComponent { }
