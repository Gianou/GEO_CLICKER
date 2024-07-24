import L, { LatLngExpression } from 'leaflet';

const OSM = L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:
        '&copy; <a href="https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml?lang=de">OpenStreetMap</a> contributors',
});

const SAT = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

export const TILES_LAYERS = {
    Sat: SAT,
    OpenStreetMap: OSM,
};

const CENTER: LatLngExpression = [46.8, 8.2];

export const MAP_OPTIONS = {
    center: CENTER,
    zoom: 8,
    layers: [SAT],
}