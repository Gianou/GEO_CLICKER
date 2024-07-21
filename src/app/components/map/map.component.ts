import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { MapDataService } from '../../services/map-data.service';
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
    private http: HttpClient
  ) { }
  private _map: any;
  private _geojsonFileName = "NUTS_switzerland";
  private _geojsonLayer: any;
  private _selectedStyle = { color: 'blue', weight: 2 };
  private _defaultStyle = { color: 'grey', weight: 2, opacity: 0 };

  ngOnInit() {
    this.createMap();
    this.loadGeoJSON();
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
    this._geojsonLayer.setStyle((feature: { properties: { isSelected: boolean; }; }) => {
      return feature.properties.isSelected ? this._selectedStyle : this._defaultStyle;
    });
  }

  loadGeoJSON() {
    this.http.get(`assets/geojson/${this._geojsonFileName}.geojson`).subscribe((geojson: any) => {
      this._geojsonLayer = L.geoJSON(geojson, {
        style: (feature) => {
          return feature!.properties.style || this._defaultStyle; // Default style
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
    });
  }

  // ngAfterViewChecked(): void {
  //   console.log('yo');
  //   window.dispatchEvent(new Event('resize'));
  // }
}
