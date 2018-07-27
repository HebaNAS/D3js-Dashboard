/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*    File Description: Create a collapsible force layout  given a dataset   */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 27 July 2018                                */
/*****************************************************************************/

// Import d3 library
import * as d3 from 'd3';

import DataManager from '../models/data';

// Instantiate a new Data Manager Class
const dataManager = new DataManager();

// Create a function to draw a horizontal barchart giving a dataset and a DOM
// element as arguments
export default class ForceLayout {

  // Create constructor function
  constructor(data, cityData, selectedUoa, selectedUni, type, showImpact) {
    this.data = data;
    this.cityData = cityData;
    this.selectedUoa = selectedUoa;
    this.selectedUni = selectedUni;
    this.hierarchicalData = [];
    this.type = type;
    this.showImpact = showImpact;
  }

  createChart() {

    // Create hierarchy from our dataset
    this.hierarchicalData = 
      dataManager.reformatUoaData(
        dataManager.createUoaPerUniPerformanceHierarchy(
          this.data, this.selectedUni
        )
      );

    /*------------------------------------------------------*/
    
    /*
     * Variables
     */


    // Get parent element
    const svgDOM = document.getElementById('graph');
    // Get the current selection from the select box
    const selectBox = document.getElementById('selector');

    let selectedUniversity = this.selectedUni;
    let uoa = this.selectedUoa;
    let dataType = this.type;

    // Append svg to the leaflet map and specify width and height as the same
    // for the parent DOM element, then append a group to hold all markers
    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', svgDOM.offsetWidth)
      .attr('height', svgDOM.offsetHeight - 50);
    const g = svg.append('g');
    // https://bl.ocks.org/
    const simulation = d3.forceSimulation()
      .force('forceX', d3.forceX().strength(0.1).x(svgDOM.offsetWidth * 0.5))
      .force('forceY', d3.forceY().strength(0.1).y(svgDOM.offsetHeight * 0.5))
      .force('center', d3.forceCenter().x(svgDOM.offsetWidth * 0.5).y(svgDOM.offsetHeight * 0.5))
      .force('charge', d3.forceManyBody().strength(-15));

    // Select label class
    const labels = d3.selectAll('.label');
    // Append tooltip
    const tooltip = d3.select('.tooltip');
      // Define color domain
    const color = d3.scaleLinear()
      .domain([0, 35])
      .range(['#FFBE57', '#25CD6B']);
    // Define nodes
    let node = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.8)
      .selectAll('.node');

    /*------------------------------------------------------*/
    
    /*
     * Dynamic changes
     */

    // Draw layout
    update(this.hierarchicalData);

    // Listen for changes on the selectbox and get the selected value
    // then update the chart accordingly
    if (selectBox !== null) {
      selectBox.addEventListener('change', (event) => {
        if (dataType === 'ShowUniversity') {
          uoa = selectBox.options[selectBox.selectedIndex].value;
        } else if (dataType === 'ShowUoA') {
          selectedUniversity = selectBox.options[selectBox.selectedIndex].value;
        }
        
        this.reload(selectedUniversity, uoa);

        update(this.hierarchicalData);
      });
    }

    /*------------------------------------------------------*/

    /*
     * Private functions
     */

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
      console.log('New Dataset Force: ', data);

      // Sort the nodes so that the bigger ones are at the back
      // https://bl.ocks.org/
      data = data.sort((a,b) => {
        let sizeA = 0, sizeB = 0;
        sizeA = a.values[3].values[0].value;
        sizeB = b.values[3].values[0].value;
        
        return sizeB - sizeA;
      });

      // Bind data to nodes
      node = node.data(data);
  
      // Use General Update Pattern
      // Exit and remove unused nodes
      node.exit()
        .transition()
        .duration(100)
        .attr('r', 1e-6)
        .remove();

      // Update existing nodes
      node.transition()
        .duration(100)
        .attr('r', (d) => { return d.values[3].values[0].value + 1; });

      // Draw nodes
      node = node.enter().append('circle')
        .attr('r', (d) => { return d.values[3].values[0].value + 1; })
        .attr('fill', (d) => { return color(d.values[3].values[0].value); })
        .merge(node);
  
      // https://bl.ocks.org/
      // Dragging interactions
      node.call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

      // Update the simulation based on the data
      simulation
      .nodes(data)
      .force('collide',
        d3.forceCollide()
          .strength(0.5)
          .radius((d) => { return d.values[3].values[0].value * 1.5 + 2.5; })
          .iterations(1)
      )
      .on('tick', (d) => {
        node
          .attr('cx', (d) => { return d.x; })
          .attr('cy', (d) => { return d.y; });
      }); 
      
    }

    // https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    // https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    // https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }

  }

  /*
   * Function to reload the map with new dataset
   */
  reload(newUni, newUoa) {
    this.selectedUni = newUni;
    this.selectedUoa = newUoa;
    console.log('Reloading the chart using a new dataset');
    this.hierarchicalData = dataManager.reformatUoaData(
      dataManager.createUoaPerUniPerformanceHierarchy(
        this.data, this.selectedUni
      )
    );
  }
}