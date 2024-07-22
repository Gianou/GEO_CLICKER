import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}

  private _geojsonFileName = 'NUTS_switzerland';
  public selectedRegions: WritableSignal<string[]> = signal([]);
  public geoJson: any = signal({
    type: 'FeatureCollection',
    features: [],
  });
  public regions = computed(() => {
    return this.geoJson()
      .features.filter(
        (feature: { properties: { LEVL_CODE: number; NUTS_NAME: string } }) =>
          feature.properties.LEVL_CODE === 3
      )
      .map(
        (feature: { properties: { NUTS_NAME: string } }) =>
          feature.properties.NUTS_NAME
      )
      .sort((a: string, b: string) => a.localeCompare(b));
  });

  addOrRemoveFromSelectedRegions(regionName: string) {
    this.selectedRegions().includes(regionName)
      ? this.selectedRegions.update((value) => {
          return value.filter((region) => region !== regionName);
        })
      : this.selectedRegions.update((value) => {
          return [...value, regionName];
        });
  }

  loadGeoJSON() {
    this.http
      .get(`assets/geojson/${this._geojsonFileName}.geojson`)
      .subscribe((geojson: any) => {
        this.geoJson.set(geojson);
      });
  }

  resetGameData() {
    this.selectedRegions.set([]);
    this.geoJson.set({
      type: 'FeatureCollection',
      features: [],
    });
  }

  unselectAllRegions() {
    this.selectedRegions.set([]);
  }
}
