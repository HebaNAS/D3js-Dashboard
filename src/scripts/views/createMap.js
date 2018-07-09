/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*  File Description: Create Map and add markers latlng from provided data   */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 6 July 2018                                 */
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

  // Get map's current zoom level
  let currentZoom = map.getZoom();

  // Loop through given dataset and place markers on the map according to their
  // latitude and longitude values, also define the circle marker radius based on the
  // a given criteria (score) so locations with higher score will appear bigger
  markers.forEach((marker) => {
    let circle = L.circle([marker.value.Lat, marker.value.Lng], {
      fillOpacity: 0.5,
      radius: (marker.value.Score + 1) * 40
    });
    
    // Bind a popup to this circle marker
    circle.bindPopup('<div>' +
                    '<strong>' + marker.key + '</strong>' +
                    '<br>' +
                    '<span> 4* score: ' + marker.value.Score + '</span>' +
                    '</div>', {
                      'maxWidth': '500',
                      'className' : 'popup'
                      });

    // Listen for events on the map, hover in this case to allow for
    // a popup to appear when hovering over a location, the popup will
    // contain some information about the location
    circle.on('mouseover', function (e) {
      this.openPopup();
    });
    circle.on('mouseout', function (e) {
      this.closePopup();
    });

    // Add current circle marker with specified options to the map
    circle.addTo(map);
  });

  // Listen for map zoom interaction and readjust the marker's radius accordingly
  // so markers won't get too big and fill the screen on consecutive zoom
  map.on('zoomend', () => {
    currentZoom = map.getZoom();
    // Get each marker and set recalculate it's radius
    // (each marker was added as a new layer on the map)
    map.eachLayer((layer) => {
      if (layer._mRadius !== undefined) {
        layer.setRadius(layer._mRadius / (currentZoom * 0.25));
      }
    });
  });

}