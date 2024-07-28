import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Region } from '../models/region.model';
import { computedPrevious } from 'ngxtension/computed-previous';
import { Guess } from '../models/guess.model';


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

  public regionsToFind: Region[] = [];
  public regionToFind: Region = {
    id: "",
    name: "No region"
  }
  public guesses: Guess[] = [];

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
  ): Set<string> {
    const oldKeys = Object.keys(oldRegions);
    const newKeys = Object.keys(newRegions);

    // Find unique keys (keys present in either of the objects but not in both)
    const uniqueKeys = new Set<string>(
      [...oldKeys, ...newKeys].filter(key => !(oldKeys.includes(key) && newKeys.includes(key)))
    );

    return uniqueKeys;
  }

  startGame() {
    if (this.regions().length <= 0) {
      return;
    }
    this.regionsToFind = this.regions();
    this.regionToFind = this.regionsToFind[Math.floor(Math.random() * this.regionsToFind.length)];
    this.guesses = [];
  }

  handleAnswer(region: Region) {
    let guess: Guess = {
      regionToFind: this.regionToFind,
      guessedRegion: region,
      isCorrect: region.id === this.regionToFind.id
    }
    if (guess.isCorrect) {
      this.addOrRemoveFromSelectedRegions(region);
      this.regionsToFind = this.regionsToFind.filter(r => r.id !== region.id);
      this.regionToFind = this.regionsToFind[Math.floor(Math.random() * this.regionsToFind.length)];
    }
    this.guesses.unshift(guess);
    console.log(guess);
  }
}
