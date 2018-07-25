/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*       File Description: Create a horizontal bar chart given a dataset     */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 7 July 2018                                 */
/*****************************************************************************/

// Import d3 library
import * as d3 from 'd3';

import DataManager from '../models/data';

// Instantiate a new Data Manager Class
const dataManager = new DataManager();

// Create a function to draw a horizontal barchart giving a dataset and a DOM
// element as arguments
export default class HBarChart {

  // Create the constructor function and define variables
  constructor(data, selectedUoa) {
    this.data = data;
    this.selectedUoa = selectedUoa;
    this.selectedUni = '';
  }

  // Append svg to the selected DOM Element and set its width and height
  createChart() {

    /*
     * Variables
     */

    // Get parent element
    const svgDOM = document.getElementById('uoa-card');
    // Get map conatiner
    const map = document.getElementById('map');
    // Get the current selection from the select box
    const selectBox = document.getElementById('selector');
    // Rearrange the dataset
    const newData = this.data.map((d) => d.value);
    // Define keys for stacking our data
    const keys = ['OverallUCScore', 'Overall1Score', 'Overall2Score',
              'Overall3Score', 'Overall4Score'];
    // Define horizontal scale
    const scaleX = d3.scaleLinear()
      .rangeRound([svgDOM.offsetHeight - (svgDOM.offsetHeight / 1.8), 0]);
    // Define vertical scale
    const scaleY = d3.scaleBand()
        .rangeRound([0, svgDOM.offsetWidth / 0.86]);
    // Define color range
    const color = d3.scaleOrdinal()
        .range(['rgb(255, 190, 87)', 'rgb(255, 238, 87)', 'rgb(245, 255, 87)', 
        'rgba(219, 255, 87)', 'rgb(37, 205, 107)']);
    
    let selectedUniversity = this.selectedUni;
    let uoa = this.selectedUoa;

    // Sort the dataset based on universities 4* score
    newData.sort((a, b) => {
      return b.Overall4Score - a.Overall4Score;
    });

    // Clear the current svg
    d3.select('#uoa-card').html(null);
  
    // Define the stack structure
    const stack = d3.stack()
      .offset(d3.stackOffsetExpand);
    
    // Append the svg with the given options
    const svg = d3.select('#uoa-card').append('svg')
      .attr('width', svgDOM.offsetWidth)
      .attr('height', svgDOM.offsetHeight);
    const g = svg.append('g')
      .attr('width', svgDOM.offsetWidth)
      .attr('height', svgDOM.offsetHeight);

    /*------------------------------------------------------*/

    /*
     * Dynamic changes
     */

    // Define the domains for the scale functions
    scaleY.domain(newData.map((d) => { return d.Name; }));
    color.domain(keys);

    const serie = g.selectAll('.serie')
      .data(stack.keys(keys)(newData))
      .enter().append('g')
      .attr('class', 'serie')
      .attr('fill', (d) => color(d.key))
      .style('opacity', 0.95)
      .attr('transform', 'translate(' + (svgDOM.offsetWidth / 3.25) +
        ',' + (15 - svgDOM.offsetHeight / 100) + ')');
  
    // Using the GUP to update the chart
    serie.selectAll('rect')
      .data((d) => { return d; })
      .enter().append('rect')
      .attr('stroke', 'white')
      .attr('stroke-width', '0.5')
      .attr('x', (d) => { return scaleX(d[1]); })
      .attr('y', (d) => { return scaleY(d.data.Name); })
      .attr('height', scaleY.bandwidth())
      .attr('width', (d) => { return scaleX(d[0]) - scaleX(d[1]); });
        
    // https://bl.ocks.org
    g.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(' + (svgDOM.offsetWidth / 3.25) +
      ',' + (15 - svgDOM.offsetHeight / 100) + ')')
      .call(d3.axisLeft(scaleY));

    //https://bl.ocks.org
    const legend = serie.append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        return 'translate(' +
          (scaleY.bandwidth()) + ',' +
          (60 * (i + 1)) + ')';
      });
    
    // Legend color key
    legend.append('rect')
      .attr('x', svgDOM.offsetWidth - 190)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', color);

    // Legend text
    legend.append('text')
      .attr('x', svgDOM.offsetWidth - 200)
      .attr('y', 25.5)
      .attr('dy', '0.32em')
      .text((d) => {
        let output = '';
        if (d.key === 'Overall4Score') {
          output = '4* score';
        } else if (d.key === 'Overall3Score') {
          output = '3* score';
        } else if (d.key === 'Overall2Score') {
          output = '2* score';
        } else if (d.key === 'Overall1Score') {
          output = '1* score';
        } else if (d.key === 'OverallUCScore') {
          output = 'unclassified';
        }
        return output;
      });
  
    // Listen for selected university from map and update
    // the chart accordingly
    map.addEventListener('selectNewMarker', (event) => { 
      console.log('Selected University Changed');
      // Update the hierarchical sunburst chart with new data
      selectedUniversity = event.detail.props().name;
      newData.forEach((item) => {
        d3.selectAll('.tick text')._groups[0].forEach((el) => {
          if (el.innerHTML === selectedUniversity) {
            // Highlight selected university name
            d3.selectAll('.tick text')
              .attr('transform', 'scale(1)')
              .style('opacity', 0.25);
            d3.select(el)
              .attr('transform', 'scale(2)')
              .style('opacity', 1)
              .style('transition', 'all 0.5s');  
          }
        });
      });
    }, false);

    /*------------------------------------------------------*/

  }

  /*
   * Function to reload the map with new dataset
   */
  reload(newUni, newUoa, data) {
    this.selectedUni = newUni;
    this.selectedUoa = newUoa;
    console.log('Reloading the chart using a new dataset');

    // Rearrange the dataset
    this.data = data;
    this.createChart();
  }

}