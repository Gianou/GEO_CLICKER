import { Component, effect } from '@angular/core';
import * as L from 'leaflet';
import { GameService } from '../../services/game.service';
import { MapDataService } from '../../services/map-data.service';

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
    effect(() => {
      // For some reason, is triggered on Unselect all change
      // Like a useEffect in React, is trigger anytime the signals read in it are changed
      // Used to redraw the geojson layer on the map when the geojson changes
      gameService.geoJson(); // Necessary to ensure the effect is only triggered
      // seems to be triggering the effect when selectedRegions() changes
      this.drawLayerOnMap(); // because geojson() is read in drawLayerOnMap??
      console.log('MapComponent effect from gameService.geoJson()');
    });

    effect(() => {
      gameService.selectedRegions();
      console.log('MapComponent effect from gameService.selectedRegions()');
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
      layers: [this._mapDataService.osm],
    });

    var overlayMaps = {};

    L.control
      .layers(this._mapDataService.baseMaps, overlayMaps)
      .addTo(this._map);
  }

  drawLayerOnMap() {
    // remove the layer if it exists
    if (this._geojsonRegionLayer)
      this._map.removeLayer(this._geojsonRegionLayer);
    // add all features from the geoJson signal in gameService
    this._geojsonRegionLayer = L.geoJSON(this.gameService.geoJson(), {
      style: (feature) => {
        const regionName = feature!.properties.NUTS_NAME;
        return this.gameService.selectedRegions().includes(regionName)
          ? this._selectedStyle
          : this._defaultStyle;
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          const regionName = feature!.properties.NUTS_NAME;
          this.gameService.addOrRemoveFromSelectedRegions(regionName);
        });
      },
    }).addTo(this._map);
  }
}
