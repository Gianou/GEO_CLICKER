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

  loadGeoJSON() {

    this.http.get(`assets/geojson/${this._geojsonFileName}.geojson`).subscribe((geojson: any) => {
      var myLayer = L.geoJSON(geojson, {
        style: {
          fillOpacity: 0,
          color: 'blue', // Border color
          weight: 1, // Border weight
        },
        onEachFeature: function (feature, layer) {
          layer.on('click', () => {
            console.log(feature.properties.NUTS_NAME);
            myLayer.setStyle({
              fillOpacity: 0.1,
              color: 'blue', // Border color
              weight: 1, // Border weight
            })
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
