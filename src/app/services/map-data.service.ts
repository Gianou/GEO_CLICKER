import { Injectable } from '@angular/core';
import L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor() { }

  osm = L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml?lang=de">OpenStreetMap</a> contributors',
  });

  satSwiss = L.tileLayer(
    'https:wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg',
    {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml?lang=de">OpenStreetMap</a> contributors',
    }
  );

  sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

  baseMaps = {
    OpenStreetMap: this.osm,
    Sat: this.sat,
  };
}
