import { Component, effect } from '@angular/core';
import * as L from 'leaflet';
import { GameService } from '../../services/game.service';
import { TILES_LAYERS, MAP_OPTIONS } from '../../constants/map.data';

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

    effect(()=>{
      this.updateLayerStyles();
    })
  }
  private _map: any;
  private _geojsonRegionLayer: any;
  private _layerReferences: { [key: string]: any } = {};
  private _selectedStyle = { color: 'blue', weight: 2 , id:12};
  private _defaultStyle = { color: 'grey', weight: 2, opacity: 0, id:13 };

  ngOnInit() {
    this.createMap();
    this.gameService.loadGeoJSON();
  }

  createMap() {
    this._map = L.map('map', MAP_OPTIONS);

    L.control
      .layers(TILES_LAYERS)
      .addTo(this._map);
  }
  updateLayerStyles() {
    //@todo improve to avoid looping 2 times
    Object.values(this._layerReferences).forEach(layer => {
      if (layer.setStyle) {
        layer.setStyle(this._defaultStyle);
      }
    });

    this.gameService.selectedRegions().forEach(region => {
      const layer = this._layerReferences[region.regionId];
      if(this.gameService.selectedRegions().some(region => region.regionId === region.regionId)){
        layer.setStyle(this._selectedStyle);
      }
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
        const region : {regionId:string, regionName:string} = {regionId:regionId, regionName:regionName};
        this._layerReferences[regionId] = layer;
        layer.on('click', () => {
          this.gameService.addOrRemoveFromSelectedRegions(region);
        });
      },
    }).addTo(this._map);
  }
}
