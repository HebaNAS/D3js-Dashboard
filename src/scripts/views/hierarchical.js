/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*    File Description: Create a hierarchical chart for a given dataset      */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 16 July 2018                                */
/*****************************************************************************/

// Import D3js library
import * as d3 from 'd3';

import DataManager from '../models/data';

// Instantiate a new Data Manager Class
const dataManager = new DataManager();

export default class Hierarchical {

  // Create constructor function
  constructor(data, cityData, selectedUoa, selectedUni) {
    this.data = data;
    this.cityData = cityData;
    this.selectedUoa = selectedUoa;
    this.selectedUni = selectedUni;
    this.hierarchicalData = [];
  }

  createChart() {

    // Create hierarchy from our dataset
    this.hierarchicalData = 
      dataManager.reformatData(
        dataManager.createUniversitiesPerformanceHierarchy(
          this.data, this.selectedUoa, this.selectedUni
        )
      );

    /*------------------------------------------------------*/
    
    /*
     * Variables
     */

    // Get parent element
    const svgDOM = document.getElementById('compare-uni');
    const explanation = document.getElementById('explanation');
    // Get map conatiner
    const map = document.getElementById('map');
    // Get the current selection from the select box
    const selectBox = document.getElementById('selector');
    const selectBoxCity = document.getElementById('selector-city');

    let selectedUniversity = this.selectedUni;
    let uoa = this.selectedUoa;
    let cityData = this.cityData;

    // Append svg to the leaflet map and specify width and height as the same
    // for the parent DOM element, then append a group to hold all markers
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', svgDOM.offsetWidth)
      .attr('height', svgDOM.offsetHeight);
    const g = svg.append('g')
      .attr('transform', 'translate(' + svgDOM.offsetWidth / 2 +
      ',' + svgDOM.offsetHeight / 2.45 + ')')
      .attr('class', 'classNode');

    // Select label class
    const labels = d3.selectAll('.label');
    // Append tooltip
    const tooltip = d3.select('.tooltip');

    // Convert our JSON like structure of the dataset into a hierarchy
    // with values returned as children at each level
    let root = d3.hierarchy(this.hierarchicalData[0], (d) => d.values);   
    // Sum all values for child nodes
    root.sum((d) => d.value);
    
    // Define radius of the sunburst layout
    const radius = Math.min(svgDOM.offsetWidth, svgDOM.offsetHeight) / 2;
    
    // Define a d3 partition layout
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);
    let nodes = partition(root).descendants();

    // Define an arc based on the data
    const arc= d3.arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0 / 1.35)
      .outerRadius((d) => d.y1 / 1.35);

    const path = g.datum(root).selectAll('path');

    const color = d3.scaleLinear()
      .domain([0, 150])
      .range(['#FFBE57', '#FF3D73']);

    /*------------------------------------------------------*/
    
    /*
     * General Update Pattern (GUP)
     */

    // Enter
    path.data(nodes)
      .enter()
      .append('path')
      .attr('display', (d) => { return d.depth ? null : 'none'; })
      .attr('class', 'node')
      .attr('d', arc)
      .attr('fill-rule', 'evenodd')
      .style('fill', (d) => color(d.value))
      .style('opacity', 0.65)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', (d) => console.log(d));
    
    // Adding text labels to sunbusrt partitions based
    // on fed data
    g.selectAll('.category')
      .data(nodes.filter((d) => { return d.data.value === undefined; }))
      .enter().append('text')
      .attr('class', 'category')
      .attr('transform', (d) => {
        return 'translate(' + (arc.centroid(d)[0] + arc.centroid(d)[0] / 5 - 15) +
        ',' + (arc.centroid(d)[1] + arc.centroid(d)[1] / 100 + 5) + ')'; })
      .text((d) => { return d.depth === 1 ? d.data.key : ''; });

    g.selectAll('.label')
      .data(nodes.filter((d) => { return d.data.value > 0 && d.data.key !== 'unclassified'; }))
      .enter().append('text')
      .attr('class', 'label')
      .attr('transform', (d) => {
              return 'translate(' + arc.centroid(d) +
              ') rotate(' + computeTextRotation(d) + ')'; })
      .text((d) => { return d.parent ? d.data.key : ''; });


    /*------------------------------------------------------*/

    /*
     * Dynamic changes
     */

    // Position the explanation text circle which contains the selected
    // university name
    explanation.style.position = 'absolute';
    explanation.style.top = svgDOM.offsetHeight / 1.6 + 'px';
    explanation.style.right = svgDOM.offsetWidth / 2.2 + 'px';
    explanation.innerText = this.selectedUni;
    
    // Listen for selected university from map and update
    // the chart accordingly
    map.addEventListener('selectNewMarker', (event) => { 
      console.log('Selected University Changed');
      // Update the hierarchical sunburst chart with new data
      selectedUniversity = event.detail.props().name;
      this.reload(selectedUniversity, uoa);
      explanation.innerText = this.selectedUni;
      update(this.hierarchicalData);
    }, false);

    // Listen for changes on the selectbox and get the selected value
    // then update the chart accordingly
    if (selectBox !== null) {
      selectBox.addEventListener('change', (event) => {
        uoa = selectBox.options[selectBox.selectedIndex].value;
        this.reload(selectedUniversity, uoa);

        update(this.hierarchicalData);
      });
    }
    if (selectBoxCity !== null) {
      selectBoxCity.addEventListener('change', (event) => {
        let city = selectBoxCity.options[selectBoxCity.selectedIndex].value;
        selectedUniversity = dataManager.loadAllUniversitiesInCity(cityData, city)[0];
        this.reload(selectedUniversity, uoa);
        explanation.innerText = this.selectedUni;

        update(this.hierarchicalData);
      });
    }

    /*------------------------------------------------------*/

    /*
     * Private functions
     */

    // https://bl.ocks.org
    // Stash the old values for transition.
    function stash(d) {
      d.x0 = d.x;
      d.dx0 = d.dx;
    }

    // https://bl.ocks.org
    // Interpolate the arcs in data space.
    function arcTween(a) {
      let i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
      return function(t) {
        let b = i(t);
        a.x0 = b.x;
        a.dx0 = b.dx;
        return arc(b);
      };
    }

    // Handle mouse over events
    function handleMouseOver(d, i) {
      d3.select(this).style('opacity', 1);
      let x = event.clientX;
      let y = event.clientY; 

      // Display tooltip div containing the score
      // and position it according to mouse coordinates
      if (d.data.value !== undefined) {
        tooltip.style('display', 'block')
          .style('top', (y - 80) + 'px')
          .style('left', (x - 80) + 'px')
          .html('<strong>Score<br>' + d.data.value + ' %</strong>');
      }
    }

    // Handle mouse out events
    function handleMouseOut(d, i) {
      d3.select(this).style('opacity', 0.65);
      tooltip.style('display', 'none');
    }

    // Redraw and scale paths according to map selection
    function update(data) {
      console.log('New Dataset: ', data);

      // Update node values
      root = d3.hierarchy(data[0], (d) => d.values);
      root.sum((d) => d.value);
      nodes = partition(root).descendants();
  
      // Using the GUP to update the chart
      // Exit and remove unused entries
      g.selectAll('path')
        .exit()
        .transition()
        .duration(500)
        .remove();
      
      g.selectAll('.label')
        .exit()
        .transition()
        .duration(500)
        .remove();

      // Update existing nodes with new data
      g.selectAll('path')
        .data(nodes)
        .transition()
        .duration(500)
        .attrTween('d', arcTween);

      g.selectAll('.label')
      .data(nodes.filter((d) => { 
        return d.value > 0 && d.depth === 2 && d.data.key !== 'unclassified'; 
      }))
      .transition()
      .duration(500)
      .attr('transform', (d) => {
        return 'translate(' + arc.centroid(d) +
        ') rotate(' + computeTextRotation(d) + ')'; })
      .text((d) => { return d.data.key; });
    }

    // https://bl.ocks.org/denjn5/f059c1f78f9c39d922b1c208815d18af
    // Calculate text rotation inside arc
    function computeTextRotation(d) {
      var angle = (d.x0 + d.x1) / Math.PI * 90; 
      return (angle < 180) ? angle - 90 : angle + 90;  
    }

  }

  /*
   * Function to reload the map with new dataset
   */
  reload(newUni, newUoa) {
    this.selectedUni = newUni;
    this.selectedUoa = newUoa;
    console.log('Reloading the chart using a new dataset');
    this.hierarchicalData = dataManager.reformatData(
      dataManager.createUniversitiesPerformanceHierarchy(
        this.data, this.selectedUoa, this.selectedUni
      )
    );
  }
}