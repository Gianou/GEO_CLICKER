import { Component, effect } from '@angular/core';
import * as L from 'leaflet';
import { MapDataService } from '../../services/map-data.service';
import { GameService } from '../../services/game.service';
//import 'leaflet/dist/leaflet.css'; --> was added to angular.json in build and test

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  constructor(
    private _mapDataService: MapDataService,
    public gameService: GameService

  ) {
    effect(() => { // Like a useEffect in React, is trigger anytime the signals read in it are changed
      console.log(`Updating the _geojsonRegionLayer : ${gameService.geoJson()}`);
      this.drawLayerOnMap();
    });
  }
  private _map: any;
  private _geojsonRegionLayer: any;
  private _selectedStyle = { color: 'blue', weight: 2 };
  private _defaultStyle = { color: 'grey', weight: 2, opacity: 0 };

  ngOnInit() {
    this.createMap();
  }

  createMap() {
    this._map = L.map('map', {
      center: [46.8, 8.2],
      zoom: 8,
      layers: [this._mapDataService.citiwatts],
    });

    var overlayMaps = {};

    L.control
      .layers(this._mapDataService.baseMaps, overlayMaps)
      .addTo(this._map);

    //this._map.invalidateSize();
  }

  updateStyles() {
    this._geojsonRegionLayer.setStyle((feature: { properties: { isSelected: boolean; }; }) => {
      return feature.properties.isSelected ? this._selectedStyle : this._defaultStyle;
    });
  }

  drawLayerOnMap() {
    // remove the layer if the geoJson signal in gameService changes
    this._geojsonRegionLayer ? this._map.removeLayer(this._geojsonRegionLayer) : console.log();

    // add all features from the geoJson signal in gameService
    this._geojsonRegionLayer = L.geoJSON(this.gameService.geoJson(), {
      style: (feature) => {
        return feature!.properties.style || this._defaultStyle;
      },
      onEachFeature: (feature, layer) => {
        console.log(feature.properties.LEVL_CODE); // CH and bigger region are placed under the canton and are therefor not clickable
        feature.properties.isSelected = false;
        layer.on('click', () => {
          feature.properties.isSelected = !feature.properties.isSelected;
          this.updateStyles();
          console.log(feature.properties.NUTS_NAME + " selected : " + feature.properties.isSelected);
        })
      },
    }).addTo(this._map);

  }

  // ngAfterViewChecked(): void {
  //   this.loadGeoJSON();
  //   console.log('yo');
  //   window.dispatchEvent(new Event('resize'));
  // }
}
