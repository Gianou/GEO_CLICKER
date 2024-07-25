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
      this.drawLayerOnMap(); // this.gameService.geojson
      console.log(this.gameService.geoJson());
    });
  }
  private _map: any;
  private _geojsonRegionLayer: any;
  private _layerReferences: { [key: string]: any } = {};
  private _selectedStyle = { color: 'blue', weight: 2 };
  private _defaultStyle = { color: 'grey', weight: 2, opacity: 0 };
  private _testStyle ={ color: 'yellow', weight: 4 }

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

  updateLayerStyles(id:string){
    this._layerReferences[id].setStyle(this._testStyle);
  }

  drawLayerOnMap() {
    //remove the layer if it exists
    if (this._geojsonRegionLayer) {
      this._map.removeLayer(this._geojsonRegionLayer);
    }

    // add all features from the geoJson signal in gameService
    this._geojsonRegionLayer = L.geoJSON(this.gameService.geoJson(), {
      style: (feature) => {
        const regionName = feature!.properties.NUTS_NAME;
        console.log(feature + "drawLayerOnMap");
        return this._defaultStyle;
        return this.gameService.selectedRegions().includes(regionName)
          ? this._selectedStyle
          : this._defaultStyle;
      },
      onEachFeature: (feature, layer) => {
        const regionName = feature.id as string;
        this._layerReferences[regionName] = layer;
        layer.on('click', (itself) => {
          const regionName = feature!.properties.NUTS_NAME;
          this.gameService.addOrRemoveFromSelectedRegions(regionName);
          console.log(this._layerReferences[feature.id as string]);
          this.updateLayerStyles(feature.id as string);
        });
      },
    }).addTo(this._map);
  }
}
