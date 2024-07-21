import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * This service handles all game related stuff like:
 * -Load geoJSON
 * -return regions name
 * -Change selection state of regions
 */
export class GameService {

  constructor(
    private http: HttpClient

  ) { }

  public regions: string[] = [];
  private _geojsonFileName = "NUTS_switzerland";

  public geoJson: any = signal({
    "type": "FeatureCollection",
    "features": []
  });

  loadGeoJSON() {
    this.http.get(`assets/geojson/${this._geojsonFileName}.geojson`).subscribe((geojson: any) => {
      this.geoJson.set(geojson);
      this.regions = geojson.features
        .filter((feature: { properties: { LEVL_CODE: number; NUTS_NAME: string; }; }) => feature.properties.LEVL_CODE === 3)
        .map((feature: { properties: { NUTS_NAME: string; }; }) => feature.properties.NUTS_NAME)
        .sort((a: string, b: string) => a.localeCompare(b));
      console.log(this.regions);
    });
  }

  clearRegions() {
    this.regions = [];
    this.geoJson.set({
      "type": "FeatureCollection",
      "features": []
    });
  }

}
