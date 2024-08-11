import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Region } from '../models/region.model';
import { Guess } from '../models/guess.model';
import { GameState } from './gameState.enum';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) { }

  private _geojsonFileName = 'NUTS';


  public gameState = signal<GameState>(GameState.Setup);

  public regionsToFind: Region[] = [];
  public regionToFind: Region = {
    id: "",
    name: "No region"
  }
  public numberOfQuestions = 5;
  public questionIndex = signal(0);
  public guesses: Guess[] = [];
  public guessedRegions: Region[] = [];
  public wrongGuessedRegions: Region[] = [];

  // To automatically update UI
  public geoJson: any = signal({
    type: 'FeatureCollection',
    features: [],
  });

  public countries = computed(() => {
    // Check if the input is a valid GeoJSON object
    if (this.geoJson().type !== 'FeatureCollection' || !Array.isArray(this.geoJson().features)) {
      throw new Error('Invalid GeoJSON object');
    }

    // Extract NUTS_NAME from each feature where LEVL_CODE is 3
    return this.geoJson().features
      .filter((feature: { properties: { NUTS_NAME?: any; LEVL_CODE?: number; }; }) => {
        return feature.properties && feature.properties.NUTS_NAME && feature.properties.LEVL_CODE === 0;
      })
      .map((feature: { properties: { NUTS_NAME: any; }; }) => {
        return feature.properties.NUTS_NAME;
      });
  });

  public selectedCountry = signal("");

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

  public isGameOver = computed(() => {
    return this.questionIndex() >= this.numberOfQuestions;
  })

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

  startGame() {
    // Error block
    if (this.regions().length <= 0) {
      return;
    }
    this.loadGeoJSON();
    // Reset game data
    this.regionsToFind = [];
    this.guesses = [];
    this.regionsToFind = [];
    this.questionIndex.set(0);

    // Random set of regions
    while (this.regionsToFind.length < this.numberOfQuestions) {
      let regionToAdd = this.regions()[Math.floor(Math.random() * this.regions().length)];
      if (!this.regionsToFind.includes(regionToAdd)) {
        this.regionsToFind.push(regionToAdd);
      }
    }

    // Select first question of Quizz
    this.regionToFind = this.regionsToFind[Math.floor(Math.random() * this.regionsToFind.length)];
    this.gameState.set(GameState.Ongoing);
  }


  handleAnswer(region: Region): Guess {
    let guess: Guess = {
      regionToFind: this.regionToFind,
      guessedRegion: region,
      isCorrect: region.id === this.regionToFind.id
    }

    if (guess.isCorrect) {
      this.questionIndex.update(value => value + 1);
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

    if (this.questionIndex() >= this.numberOfQuestions) {
      this.gameState.set(GameState.Over);
    }
    return guess;
  }

  // For debug or to be removed
  resetGeoJsonData() {
    this.geoJson.set({
      type: 'FeatureCollection',
      features: [],
    });
  }

  toggleSwitzerlandOrEurope() {
    this._geojsonFileName === 'NUTS_switzerland'
      ? this._geojsonFileName = 'NUTS'
      : this._geojsonFileName = 'NUTS_switzerland'
    this.loadGeoJSON();
  }
}
