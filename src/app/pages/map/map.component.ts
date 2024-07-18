import { Component } from '@angular/core';
//import { DrawMap, Layer, Map, control } from 'leaflet';
import * as L from 'leaflet';
//import 'leaflet/dist/leaflet.css'; --> was added to angular.json in build and test

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  private _map: any;

  osm = L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml?lang=de">OpenStreetMap</a> contributors',
    bounds: [
      [45, 5],
      [48, 11],
    ],
  });
  osmSwiss = L.tileLayer(
    'https://tile.osm.ch/osm-swiss-style/{z}/{x}/{y}.png',
    {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml?lang=de">OpenStreetMap</a> contributors',
      bounds: [
        [45, 5],
        [48, 11],
      ],
    }
  );
  satSwiss = L.tileLayer(
    'https:wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg',
    {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml?lang=de">OpenStreetMap</a> contributors',
      bounds: [
        [45, 5],
        [48, 11],
      ],
    }
  );

  citiwatts = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>,' +
      ' Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    bounds: [
      [45, 5],
      [48, 11],
    ],
  });

  ngOnInit() {
    this.createMap();
  }

  createMap() {
    this._map = L.map('map', {
      center: [46.319086, 7.072506],
      zoom: 4,
      layers: [this.citiwatts],
    });

    var baseMaps = {
      OpenStreetMap: this.osm,
      'OpenStreetMap.HOT': this.osmSwiss,
      Sat: this.satSwiss,
      Citiwatts: this.citiwatts,
    };

    var overlayMaps = {};

    L.control.layers(baseMaps, overlayMaps).addTo(this._map);

    //this._map.invalidateSize();
  }
}
