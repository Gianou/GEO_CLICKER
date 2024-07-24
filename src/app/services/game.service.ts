import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) { }

  private _geojsonFileName = 'NUTS_switzerland';

  // To automatically update UI
  public selectedRegions: WritableSignal<string[]> = signal([]);

  // To automatically update UI
  public geoJson: any = signal({
    type: 'FeatureCollection',
    features: [],
  });

  // To make an ordered list of all given LEVL_CODE
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

  loadGeoJSON() {
    this.http
      .get(`assets/geojson/${this._geojsonFileName}.geojson`)
      .subscribe((geojson: any) => {
        const filteredGeojson = {
          ...geojson,
          features: geojson.features.filter(
            (feature: any) =>
              feature.properties.LEVL_CODE === 3 || // Keep regions
              feature.properties.LEVL_CODE === 0 // Keep country
          ),
        };
        this.geoJson.set(filteredGeojson);
      });
  }

  toggleSwitzerlandOrEurope() {
    this._geojsonFileName === 'NUTS_switzerland'
      ? this._geojsonFileName = 'NUTS'
      : this._geojsonFileName = 'NUTS_switzerland'
    this.loadGeoJSON();
  }

  addOrRemoveFromSelectedRegions(regionName: string) {
    //This could be improved with IDs
    //Nuts have unique ID in feature.id
    this.selectedRegions().includes(regionName)
      ? this.selectedRegions.update((value) => {
        return value.filter((region) => region !== regionName);
      })
      : this.selectedRegions.update((value) => {
        return [...value, regionName];
      });
  }

  resetGameData() {
    this.unselectAllRegions();
    this.geoJson.set({
      type: 'FeatureCollection',
      features: [],
    });
  }

  unselectAllRegions() {
    this.selectedRegions.set([]);
  }
}
