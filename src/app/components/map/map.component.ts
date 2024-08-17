import { Component, effect } from '@angular/core';
import * as L from 'leaflet';
import { GameService } from '../../services/game.service';
import { TILES_LAYERS, MAP_OPTIONS } from '../../constants/map.data';
import { Region } from '../../models/region.model';
import { Guess } from '../../models/guess.model';
import centroid from '@turf/centroid';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  constructor(
    public gameService: GameService
  ) {

    effect(() => {
      this.gameService.regions();
      this.drawLayerOnMap();
      console.log("regions changed");
    })

    effect(() => {
      this.drawLayerOnMap();
    });

    effect(() => {
      if (this.gameService.isGameOver()) {
        for (const layer of Object.values(this._layerReferences)) {
          layer.off('click');
        }
      }
    })

    effect(() => {
      if (this.gameService.selectedCountry().geometry === "") {
        return
      }
      const centerPoint = centroid(this.gameService.selectedCountry().geometry);
      const coordinates = centerPoint.geometry.coordinates;
      console.log(coordinates);
      this._map.setView([coordinates[1], coordinates[0]], 7);
    });
  }
  private _map: any;
  private _geojsonRegionLayer: any;
  private _layerReferences: { [key: string]: any } = {};
  private _selectedStyle = { fillColor: 'blue', fillOpacity: 0.4, weight: 3, opacity: 0.6, id: 12 };
  private _defaultStyle = { color: '#202020', fillColor: 'grey', fillOpacity: 0.3, weight: 3, opacity: 0.6, id: 13 };
  private _wrongStyle = { fillColor: 'red', fillOpacity: 0.3, weight: 3, opacity: 0.6, id: 13 };

  ngOnInit() {
    this.createMap();
    this.gameService.loadGeoJSON();
  }

  createMap() {
    this._map = L.map('map', MAP_OPTIONS);
    this._map.doubleClickZoom.disable();
  }

  drawLayerOnMap() {
    //remove the layer if it exists
    if (this._geojsonRegionLayer) {
      this._map.removeLayer(this._geojsonRegionLayer);
    }

    // add all features from the geoJson signal in gameService
    this._geojsonRegionLayer = L.geoJSON(this.gameService.filteredGeoJson(), {
      style: this._defaultStyle,
      onEachFeature: (feature, layer) => {
        const regionId = feature.id as string;
        const regionName = feature.properties.NUTS_NAME as string;
        const region: Region = { id: regionId, name: regionName };
        this._layerReferences[regionId] = layer;
        layer.on('click', () => {
          let guess = this.gameService.handleAnswer(region);
          this.setRegionStyle(guess);
        });
      },
    }).addTo(this._map);
  }

  setRegionStyle(guess: Guess) {
    let layer = this._layerReferences[guess.guessedRegion.id]
    if (guess.isCorrect) {
      layer.setStyle(this._selectedStyle);
      this.gameService.guessedRegions.push(guess.guessedRegion);
      for (let region of this.gameService.wrongGuessedRegions) {
        let layerToReset = this._layerReferences[region.id]
        layerToReset.setStyle(this._defaultStyle);
        layerToReset.on('click', () => {
          let guess = this.gameService.handleAnswer(region);
          this.setRegionStyle(guess);
        });
      }
      this.gameService.wrongGuessedRegions = []
    }
    else {
      layer.setStyle(this._wrongStyle);
      this.gameService.wrongGuessedRegions.push(guess.guessedRegion);
    }
    layer.off('click');
  }

}