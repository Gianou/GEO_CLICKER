import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

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
    private http: HttpClient
  ) { }
  ngOnInit() {
    this.loadGeoJSON();
  }
  loadGeoJSON() {
    this.http.get(`assets/geojson/${this._geojsonFileName}.geojson`).subscribe((geojson: any) => {
      this.regions = geojson.features
        .filter((feature: { properties: { LEVL_CODE: number; NUTS_NAME: string; }; }) => feature.properties.LEVL_CODE === 3)
        .map((feature: { properties: { NUTS_NAME: string; }; }) => feature.properties.NUTS_NAME)
        .sort((a: string, b: string) => a.localeCompare(b));
    });
  }
}
