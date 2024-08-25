import { Component, effect } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { NgClass } from '@angular/common';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [NgClass, GameMenuComponent],
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.css'
})
export class GameMenuComponent {
  constructor(
    public gameService: GameService,
    public deviceService: DeviceService
  ) {
  }

}
