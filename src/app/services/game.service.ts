import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Region } from '../models/region.model';
import { Guess } from '../models/guess.model';
import { GameState } from './gameState.enum';
import { Country } from '../models/country';
import * as L from 'leaflet';
import { Feature } from 'geojson';


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

  public geoJson: any = signal({
    type: 'FeatureCollection',
    features: [],
  });

  public filteredGeoJson: any = computed(() => {
    // Filter the GeoJSON features to include only those with the desired country code
    const filteredFeatures = this.geoJson().features.filter(
      (feature: { properties: { CNTR_CODE?: string } }) =>
        feature.properties.CNTR_CODE === this.selectedCountry().code
    );

    // Return the updated GeoJSON object with filtered features
    return {
      type: 'FeatureCollection',
      features: filteredFeatures
    };
  }
  );

  public countries = computed<Country[]>(() => {
    // Check if the input is a valid GeoJSON object
    if (this.geoJson().type !== 'FeatureCollection' || !Array.isArray(this.geoJson().features)) {
      throw new Error('Invalid GeoJSON object');
    }

    // Extract country name, code and geometry from each feature where LEVL_CODE is 0
    return this.geoJson().features
      .filter((feature: Feature) => {
        return feature.properties && feature.properties['NUTS_NAME'] && feature.properties['LEVL_CODE'] === 0 && feature.properties['CNTR_CODE'];
      })
      .map((feature: Feature) => {
        return {
          name: feature.properties?.['NUTS_NAME'] ?? "error",
          code: feature.properties?.['CNTR_CODE'] ?? "error",
          geometry: feature.geometry
        } as Country;
      })
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  });

  public selectedCountry = signal<Country>({ name: "", code: "", geometry: "" });
  public isACountrySelected = computed<boolean>(() => {
    return this.selectedCountry().code === "" ? false : true;
  })

  public regions = computed<Region[]>(() => {
    return this.geoJson().features
      .filter(
        (feature: { properties: { LEVL_CODE: number; NUTS_NAME: string; CNTR_CODE?: string } }) =>
          feature.properties.LEVL_CODE === 3 && feature.properties.CNTR_CODE === this.selectedCountry().code
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
    if (this.regions().length < this.numberOfQuestions) {
      alert("Not enough regions in there");
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
        this.regionToFind = { id: '0', name: "Game Completed" } as Region
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
