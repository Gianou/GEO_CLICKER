import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Region } from '../models/region.model';
import { computedPrevious } from 'ngxtension/computed-previous';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) { }

  private _geojsonFileName = 'NUTS_switzerland';

  // To automatically update UI
  // All the selected Region
  public selectedRegions: WritableSignal<{ [regionId: string]: Region }> = signal({});
  // The previous state of selectedRegions
  public previousSelectedRegions = computedPrevious(this.selectedRegions);
  // All the Regions whose selection state changed
  public changedSelectedRegions = computed(() => {
    return this.findUniqueEntries(this.selectedRegions(), this.previousSelectedRegions());
  })


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
          id: regionId,
          name: feature.properties.NUTS_NAME
        };
      })
      .sort((a: Region, b: Region) => a.name.localeCompare(b.name));
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
    const currentRegions = this.selectedRegions();

    if (currentRegions[region.id]) {
      this.selectedRegions.update(value => {
        const { [region.id]: _, ...newValue } = value;
        return newValue;
      });
    } else {
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
  findUniqueEntries(
    oldRegions: { [regionId: string]: Region },
    newRegions: { [regionId: string]: Region }
  ): { [regionId: string]: Region } {
    const oldKeys = Object.keys(oldRegions);
    const newKeys = Object.keys(newRegions);

    // Find unique keys (keys present in either of the objects but not in both)
    const uniqueKeys = new Set<string>(
      [...oldKeys, ...newKeys].filter(key => !(oldKeys.includes(key) && newKeys.includes(key)))
    );

    // Construct the result object containing entries with unique keys
    const result = [...uniqueKeys].reduce((acc, key) => {
      if (oldRegions[key]) acc[key] = oldRegions[key];
      if (newRegions[key]) acc[key] = newRegions[key];
      return acc;
    }, {} as { [regionId: string]: Region });

    return result;
  }
}
