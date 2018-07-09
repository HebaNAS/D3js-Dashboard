/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*                     File Description: Create Map                          */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 6 July 2018                                 */
/*****************************************************************************/

// Import Leaflet module for creating maps
import * as L from 'leaflet';

export default function createMap(markers) {
  // Create the map and set geographical bounds to UK's latlng as well as set the zoom level
  var map = L.map('map', {
    zoomControl: false
  }).setView([54.505, -3.5], 5);

  // Add a new tile layer with the actual map features, set the options
  L.tileLayer('https://api.mapbox.com/styles/v1/hebaelshimy/cjjb2m2ss5cj62so6remsqx4s/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGViYWVsc2hpbXkiLCJhIjoiY2o4YjdzZWF4MGtxMDJxczB2dDA4ZXNsOSJ9.hUkmJ7j6KuQyVMZPN9Xxpg', {
    minZoom: 5,
    maxZoom: 15,
    detectRetina: true,
    reuseTiles: true, 
    unloadInvisibleTiles: true
  }).addTo(map);

  let currentZoom = map.getZoom();

  markers.forEach((marker) => {
    L.circle([marker.value.Lat, marker.value.Lng], {
      fillOpacity: 0.5,
      radius: (marker.value.Score + 1) * 20
    }).addTo(map);
  });

  map.on('zoomend', () => {
    currentZoom = map.getZoom();
    
    map.eachLayer((layer) => {
      //let originalRadius = layer._mRadius - 1 / 500 ;
      //console.log(originalRadius);
      if (layer._mRadius !== undefined) {
        layer.setRadius(layer._mRadius / currentZoom);
      }
    });
  });

}