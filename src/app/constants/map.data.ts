import L, { LatLngExpression } from 'leaflet';

const SAT = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        maxZoom: 12,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

export const TILES_LAYERS = {
    Sat: SAT,
};

const CENTER: LatLngExpression = [46.8, 8.2];

export const MAP_OPTIONS = {
    center: CENTER,
    zoom: 7,
    layers: [SAT],
}