import { Component, effect } from '@angular/core';
import * as L from 'leaflet';
import { GameService } from '../../services/game.service';
import { TILES_LAYERS, MAP_OPTIONS } from '../../constants/map.data';
import { Region } from '../../models/region.model';

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
      this.drawLayerOnMap();
    });

    effect(() => {
      this.updateRegionStyle(this.gameService.changedSelectedRegions());
    })
  }
  private _map: any;
  private _geojsonRegionLayer: any;
  private _layerReferences: { [key: string]: any } = {};
  private _selectedStyle = { color: 'blue', fillOpacity: 0.4, weight: 2, opacity: 0.6, id: 12 };
  private _defaultStyle = { color: 'grey', fillOpacity: 0.3, weight: 2, opacity: 0.4, id: 13 }; // Opacity for borders

  ngOnInit() {
    this.createMap();
    this.gameService.loadGeoJSON();
  }

  createMap() {
    this._map = L.map('map', MAP_OPTIONS);
    this._map.doubleClickZoom.disable();

    L.control
      .layers(TILES_LAYERS)
      .addTo(this._map);
  }

  updateRegionStyle(keys: Set<string>) {
    keys.forEach(key => {
      const selectedRegions = this.gameService.selectedRegions();
      const layer = this._layerReferences[key];
      if (selectedRegions[key]) {
        layer.setStyle(this._selectedStyle);
      }
      else {
        layer.setStyle(this._defaultStyle);
      }
      console.log("Changed a region layer");
    });
  }

  drawLayerOnMap() {
    //remove the layer if it exists
    if (this._geojsonRegionLayer) {
      this._map.removeLayer(this._geojsonRegionLayer);
    }

    // add all features from the geoJson signal in gameService
    this._geojsonRegionLayer = L.geoJSON(this.gameService.geoJson(), {
      style: this._defaultStyle,
      onEachFeature: (feature, layer) => {
        const regionId = feature.id as string;
        const regionName = feature.properties.NUTS_NAME as string;
        const region: Region = { id: regionId, name: regionName };
        this._layerReferences[regionId] = layer;
        layer.on('click', () => {
          //this.gameService.addOrRemoveFromSelectedRegions(region);
          this.gameService.checkClickedAnswer(region);
        });
      },
    }).addTo(this._map);
  }
}