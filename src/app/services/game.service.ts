import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Region } from '../models/region.model';
import { computedPrevious } from 'ngxtension/computed-previous';
import { Guess } from '../models/guess.model';
import { isEmpty } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) { }

  private _geojsonFileName = 'NUTS_switzerland';

  public regionsToFind: Region[] = [];
  public regionToFind: Region = {
    id: "",
    name: "No region"
  }
  public guesses: Guess[] = [];
  public guessedRegions: Region[] = [];
  public wrongGuessedRegions: Region[] = [];

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

  resetGameData() {
    this.geoJson.set({
      type: 'FeatureCollection',
      features: [],
    });
  }

  startGame() {
    if (this.regions().length <= 0) {
      return;
    }
    this.regionsToFind = this.regions();
    this.regionToFind = this.regionsToFind[Math.floor(Math.random() * this.regionsToFind.length)];
    this.guesses = [];
  }

  handleAnswer(region: Region): Guess {
    let guess: Guess = {
      regionToFind: this.regionToFind,
      guessedRegion: region,
      isCorrect: region.id === this.regionToFind.id
    }

    if (guess.isCorrect) {
      this.regionsToFind = this.regionsToFind.filter(r => r.id !== region.id);
      if (this.regionsToFind.length <= 0) {
        console.log("game is over");
        this.regionToFind = { id: '0', name: "Game Completed" } as Region
        console.log(this.regionToFind);
      }
      else {
        this.regionToFind = this.regionsToFind[Math.floor(Math.random() * this.regionsToFind.length)];
      }
    }

    this.guesses.unshift(guess);
    return guess;
  }
}
