import { Injectable } from '@angular/core';
import L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor() {}

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
    //tileSize: 400,
    zIndex: 1,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>,' +
      ' Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    bounds: [
      [45, 5],
      [48, 11],
    ],
  });
  baseMaps = {
    OpenStreetMap: this.osm,
    'OpenStreetMap.HOT': this.osmSwiss,
    Sat: this.satSwiss,
    Citiwatts: this.citiwatts,
  };
}
