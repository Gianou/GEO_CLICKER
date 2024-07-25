import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Region } from '../models/region.model';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) { }

  private _geojsonFileName = 'NUTS_switzerland';

  // To automatically update UI
  // public selectedRegions: WritableSignal<{ regionId: string, regionName: string }[]> = signal([]);
  //public selectedRegions: WritableSignal<{ [regionId: string]: Region }> = signal({});
  public selectedRegions: WritableSignal<{ [regionId: string]: Region }> = signal({});


  // To automatically update UI
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
      .map((feature: { id: string; properties: { NUTS_NAME: string } }) => {
        const regionId = feature.id as string;
        return {
          regionId: regionId,
          regionName: feature.properties.NUTS_NAME
        };
      })
      .sort((a: { regionName: string; }, b: { regionName: any; }) => a.regionName.localeCompare(b.regionName));
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

  addOrRemoveFromSelectedRegions(region: Region) {
    console.log(region);
    const currentRegions = this.selectedRegions();

    if (currentRegions[region.id]) {
      // Remove the region from the object
      console.log("Region in the object");
      this.selectedRegions.update(value => {
        const { [region.id]: _, ...newValue } = value;
        return newValue;
      });
    } else {
      // Add the region to the object
      this.selectedRegions.update(value => ({
        ...value,
        [region.id]: region
      }));
    }
  }

  resetGameData() {
    this.unselectAllRegions();
    this.geoJson.set({
      type: 'FeatureCollection',
      features: [],
    });
  }

  unselectAllRegions() {
    this.selectedRegions.set({});
  }
}
