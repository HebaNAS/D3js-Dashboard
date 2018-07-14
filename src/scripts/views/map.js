/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*  File Description: Create Map and add markers latlng from provided data   */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 6 July 2018                                 */
/*****************************************************************************/

// Import D3js library
import * as d3 from 'd3';
// Import Leaflet module for creating maps
import * as L from 'leaflet';

export default class Map {

  // Create the constructor function
  constructor(mapData) {
    this.mapData = mapData;
    this.map = {};
  }

  /*
   * Function that draws a map inside the specified element in the DOM
   * and takes in data and uses that to draw markers for locations on the map
   */
  createMap() {
    // Create the map and set geographical bounds to UK's latlng as well as set the zoom level
    this.map = L.map('map', {
      zoomControl: false,
      watch: true
    }).setView([54.505, -3.5], 5);

    // Add a new tile layer with the actual map features, set the options
    L.tileLayer('https://api.mapbox.com/styles/v1/hebaelshimy/cjjb2m2ss5cj62so6remsqx4s/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGViYWVsc2hpbXkiLCJhIjoiY2o4YjdzZWF4MGtxMDJxczB2dDA4ZXNsOSJ9.hUkmJ7j6KuQyVMZPN9Xxpg', {
      minZoom: 5,
      maxZoom: 15,
      detectRetina: true,
      reuseTiles: true, 
      unloadInvisibleTiles: true
    }).addTo(this.map);
  }
  
  render() {

    /*
     * Canvas cleanup and data massaging
     */

    // Clear marker points from the map
    d3.select('#map .leaflet-marker-pane').html(null);
    
    // Reformat our data into a form that could be understood by
    // d3's geoPath method
    this.mapData.forEach((d) => {
      if (d.type === undefined) {
        d.type = 'Feature';
        d.geometry = {};
        d.properties = {};
        d.properties.cartisan = {};
        d.properties.name = d.key;
        d.properties.score = d.value.Score;
        d.properties.cartisan.x =
          this.map.latLngToLayerPoint(new L.LatLng(d.value.Lat, d.value.Lng)).x;
        d.properties.cartisan.y =
          this.map.latLngToLayerPoint(new L.LatLng(d.value.Lat, d.value.Lng)).y;
        d.geometry.type = 'Point';
        d.geometry.coordinates = [d.value.Lat, d.value.Lng];
        delete d.key;
        delete d.value;
      }
    });

    /*------------------------------------------------------*/

    /*
     * Variables
     */
    
    // Get parent element (map conatiner)
    const svgDOM = document.getElementById('map');
    
    // Append svg to the leaflet map and specify width and height as the same
    // for the parent DOM element, then append a group to hold all markers
    const svg = d3.select(this.map.getPanes().markerPane)
      .append('svg')
      .attr('width', svgDOM.offsetWidth)
      .attr('height', svgDOM.offsetHeight);
    const g = svg.append('g');

    // Create a projection to transform points locations from latitude and longitude
    // to x and y coordinates to represent on the screen
    const map = this.map,
      transform = d3.geoTransform({point: projectPoint }),
      path = d3.geoPath().projection(transform);

    const markers = g.selectAll('path');

    /*------------------------------------------------------*/
    
    /*
     * General Update Pattern (GUP)
     */
    // Exit
    markers.exit()
      .transition()
      .duration(250)
      .remove();

    // Create markers to represent locations of data points, bind the data,
    // enter the general update pattern
    markers.data(this.mapData)
      .enter()
      .append('path')
      .attr('d', path.pointRadius((d) => parseInt(d.properties.score / 5 + 1)))
      .attr('pointer-events', 'visible')
      .classed('leaflet-marker-icon', true)
      .classed('leaflet-zoom-animated', true)
      .classed('leaflet-clickable', true)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Update
    markers.transition()
      .duration(250)
      .attr('d', path);

    // Listen for map movements and zoom and trigger the update function
    this.map.on('moveend', update);
    update();

    /*------------------------------------------------------*/

    /*
     * Private helper functions
     */
    // Create a custom geometric transformation to adapt the different
    // geometries of Leaflet and D3js
    function projectPoint(x, y) {
      let point = map.latLngToLayerPoint(new L.LatLng(x, y));
      this.stream.point(point.x, point.y);
    }

    // Redraw and scale points according to map movement and zoom
    function update() {
      console.log('Map moved, Redrawing markers');
  
      // Using the GUP
      g.selectAll('path')
        .exit()
        .transition()
        .duration(100)
        .remove();

      g.selectAll('path')
        .transition()
        .duration(250)
        .attr('d', path);
    }

    // Handle mouse over interactions
    function handleMouseOver(d, i) {
      d3.select(this).style('opacity', 0.85);

      let self = this;
      let data = d;
      let popup = d3.select(map.getPanes().popupPane)
        .append('div')
        .classed('leaflet-popup', true)
        .style('top', d3.mouse(self)[1] - 90 + 'px')
        .style('left', d3.mouse(self)[0] - 110 + 'px');
      popup.classed('popup', true);
      popup.append('a')
        .classed('leaflet-popup-close-button', true)
        .attr('href', '#close')
        .text('x');
      
      let tip = popup.append('div')
        .classed('leaflet-popup-tip-container', true)
        .style('top', 71 + 'px');
      tip.append('div')
        .classed('leaflet-popup-tip', true);
      
      let wrapper = popup.append('div')
        .classed('leaflet-popup-content-wrapper', true);
      wrapper.append('div')
        .classed('leaflet-popup-content', true)
        .html('<strong>' + data.properties.name + '</strong><br>' +
              '<span>4* Score: ' + data.properties.score + '</span>');
    }

    // Handle mouse out interactions
    function handleMouseOut(d, i) {
      d3.select(this).style('opacity', 0.65);
      d3.select(map.getPanes().popupPane).html(null);
    }

    /*------------------------------------------------------*/

    return this.map;
  }

  /*
   * Function to reload the map with new dataset
   */
  reload(newData) {
    this.mapData = newData;
    console.log('New Dataset: ', this.mapData);
    console.log('Reloading the map using a new dataset');
    this.render();
  }

}