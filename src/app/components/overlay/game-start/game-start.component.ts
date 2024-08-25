import { Component, effect } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [NgClass, MatSelectModule, MatButton],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.css'
})
export class GameStartComponent {
  constructor(
    public gameService: GameService,
    private snackBar: MatSnackBar
  ) { }

  onSelectCountry(country: any) {
    this.gameService.selectedCountry.set(country);
  }

  startGame() {
    if (!this.gameService.isACountrySelected()) {
      this.showToaster('No country selected, please select a country');
      return
    }
    this.gameService.startGame();
  }
  private showToaster(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position horizontally
      verticalPosition: 'top', // Position vertically
    });
  }
}
