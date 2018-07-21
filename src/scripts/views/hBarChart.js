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
  constructor(data) {
    this.data = data;
  }

  // Append svg to the selected DOM Element and set its width and height
  createChart() {
    //console.log(this.data);
    /*
     * Variables
     */

    // Get parent element
    const svgDOM = document.getElementById('uoa-card');
    // Get all universities as keys
    const universities = dataManager.loadAllUoAs(this.data);
    // Define margins around the chart
    const margin = {top: 20, right: 20, bottom: 20, left: 80};
    // Define horizontal scale
    const scaleX = d3.scaleBand()
      .rangeRound([0, svgDOM.offsetWidth])
      .paddingInner(0.05)
      .align(0.1);
    // Define vertical scale
    const scaleY = d3.scaleLinear()
        .rangeRound([svgDOM.offsetHeight, 0]);
    // Define color range
    const color = d3.scaleLinear()
        .range(['#25CD6B', '#FFBE57']);

    const results = this.data.sort((a, b) => { return b.Overall4Score - a.Overall4Score; });
      scaleX.domain(this.data.map((d) => { return d.key; }));
      scaleY.domain([0, d3.max(this.data, (d) => { return 100; })]).nice();
      color.domain(universities);
    //console.log(results);
    
    // Append the svg with the given options
    d3.select('#uoa-card').append('svg')
      .attr('width', svgDOM.offsetWidth)
      .attr('height', svgDOM.offsetHeight);
  }

}