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
  ) {}
  private _map: any;

  ngOnInit() {
    this.createMap();
    this.loadGeoJSON();
  }

  createMap() {
    this._map = L.map('map', {
      center: [46.9, 7.88],
      zoom: 7,
      layers: [this._mapDataService.citiwatts],
    });

    var overlayMaps = {};

    L.control
      .layers(this._mapDataService.baseMaps, overlayMaps)
      .addTo(this._map);

    //this._map.invalidateSize();
  }

  loadGeoJSON() {
    this.http
      .get('assets/geojson/switzerland_border.geojson')
      .subscribe((geojson: any) => {
        L.geoJSON(geojson).addTo(this._map);
      });
  }

  // ngAfterViewChecked(): void {
  //   console.log('yo');
  //   window.dispatchEvent(new Event('resize'));
  // }
}
