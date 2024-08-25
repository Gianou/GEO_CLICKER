import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { GameService } from '../../../services/game.service';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-find-prompt',
  standalone: true,
  imports: [NgClass],
  templateUrl: './find-prompt.component.html',
  styleUrl: './find-prompt.component.css'
})
export class FindPromptComponent {
  constructor(
    public gameService: GameService,
    public deviceService: DeviceService
  ) {
  }

}
