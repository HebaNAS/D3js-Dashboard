/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*       File Description: Create a horizontal bar chart given a dataset     */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 7 July 2018                                 */
/*                     Student Contribution: 80%                             */
/*                     Code from reference: 20%                              */
/*                 References:  https://bl.ocks.org/                         */
/*****************************************************************************/

// Import d3 library
import * as d3 from 'd3';

import DataManager from '../models/data';
import { on } from 'cluster';

// Instantiate a new Data Manager Class
const dataManager = new DataManager();

// Create a function to draw a horizontal barchart giving a dataset and a DOM
// element as arguments
export default class HBarChart {

  // Create the constructor function and define variables
  constructor(orgData, data, selectedUoa, selectedUni, type) {
    this.originalData = orgData;
    this.data = data;
    this.selectedUoa = selectedUoa;
    this.selectedUni = selectedUni;
    this.type = type;
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
    // Get force layout conatiner
    const force = document.getElementById('graph');
    // Rearrange the dataset
    let newData = this.data.map((d) => d.value);
    // Sort the dataset based on universities 4* score
    newData = newData.sort((a, b) => {
      return b.Overall4Score - a.Overall4Score;
    });
    // Define keys for stacking our data
    const keys = ['OverallUCScore', 'Overall1Score', 'Overall2Score',
              'Overall3Score', 'Overall4Score'];
    // Define horizontal scale
    const scaleX = d3.scaleLinear();
    if (this.type !== 'StackUoa') {
      scaleX
        .rangeRound([svgDOM.offsetHeight - (svgDOM.offsetHeight / 1.8), 0]);
    } else {
      scaleX
        .rangeRound([svgDOM.offsetHeight - (svgDOM.offsetHeight / 1.5), 0]);
    }
    // Define vertical scale
    const scaleY = d3.scaleBand()
        .rangeRound([0, svgDOM.offsetWidth / 0.86]);
    // Define color range
    const color = d3.scaleOrdinal()
        .range(['rgb(255, 190, 87)', 'rgb(255, 238, 87)', 'rgb(245, 255, 87)', 
        'rgba(219, 255, 87)', 'rgb(37, 205, 107)']);
    
    let selectedUniversity = this.selectedUni;
    let uoa = this.selectedUoa;
    let orgData = this.originalData;

    // Clear the current svg
    d3.select('#uoa-card').html(null);

    // Get all overall 4 star scores
    let Overall4StarScores = [];
    newData.forEach((item) => {
      Overall4StarScores.push(item.Outputs4Score);
    });

    // Statistics & calculation of lower, middle and upper quartile
    const lower = quantile(Overall4StarScores, 1, 4);
    const mid = quantile(Overall4StarScores, 2, 4);
    const upper = quantile(Overall4StarScores, 3, 4);

    let uniQuartiles = [];
    let displayedResults = [];
    newData.forEach((item) => {
      if (item.Outputs4Score === lower) {
        uniQuartiles.push(item.Name);
        displayedResults.push('Lower Q. (' + item.Outputs4Score + ')');
      } else if (item.Outputs4Score === mid) {
        uniQuartiles.push(item.Name);
        displayedResults.push('Average (' + item.Outputs4Score + ')');
      } else if (item.Outputs4Score === upper) {
        uniQuartiles.push(item.Name);
        displayedResults.push('Upper Q. (' + item.Outputs4Score + ')');
      }
    });
  
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
    if (this.type !== 'StackUoa') {
      scaleY.domain(newData.map((d) => { return d.Name; }));
    } else {
      scaleY.domain(newData.map((d) => { return d.Uoa; }));
    }
    color.domain(keys);

    const serie = g.selectAll('.serie')
      .data(stack.keys(keys)(newData))
      .enter().append('g')
      .attr('class', 'serie')
      .attr('fill', (d) => color(d.key))
      .style('opacity', 0.95);
  
    if (this.type !== 'StackUoa') {
      serie.attr('transform', 'translate(' + (svgDOM.offsetWidth / 3.25) +
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
    } else {
      serie.attr('transform', 'translate(' + (svgDOM.offsetWidth / 2.75) +
          ',' + (15 - svgDOM.offsetHeight / 100) + ')');

      // Using the GUP to update the chart
      serie.selectAll('rect')
        .data((d) => { return d; })
        .enter().append('rect')
        .attr('stroke', 'white')
        .attr('stroke-width', '0.5')
        .attr('x', (d) => { return scaleX(d[1]); })
        .attr('y', (d) => { return scaleY(d.data.Uoa); })
        .attr('height', scaleY.bandwidth())
        .attr('width', (d) => { return scaleX(d[0]) - scaleX(d[1]); })
        .style('cursor', 'pointer')
        .on('click', handleClick);
    }
       
    if (this.type !== 'StackUoa') {
      // Left axis
      // https://bl.ocks.org
      g.append('g')
        .attr('class', 'axis axis--y')
        .attr('transform', 'translate(' + (svgDOM.offsetWidth / 3.25) +
        ',' + (15 - svgDOM.offsetHeight / 100) + ')')
        .call(d3.axisLeft(scaleY));
    } else {
      g.append('g')
        .attr('class', 'axis axis--y')
        .attr('transform', 'translate(' + (svgDOM.offsetWidth / 2.75) +
        ',' + (15 - svgDOM.offsetHeight / 100) + ')')
        .call(d3.axisLeft(scaleY));
    }

    if (this.type === 'ShowUniversity' || this.type === 'StackUoa') {
      const legend = serie.append('g');
      
      if (this.type !== 'StackUoa') {
        // Legend
        //https://bl.ocks.org
        legend.attr('class', 'legend')
          .attr('transform', (d, i) => {
            return 'translate(' +
              (scaleY.bandwidth()) + ',' +
              (60 * (i + 1)) + ')';
          });
      } else {
        legend.attr('class', 'legend')
          .attr('transform', (d, i) => {
            return 'translate(' +
              (scaleY.bandwidth() - 2000 / scaleY.bandwidth()) + ',' +
              (60 * (i + 1)) + ')';
          });
      } 

      // Legend color key
      legend.append('rect')
        .attr('x', svgDOM.offsetWidth - 183)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', color);

      // Legend text
      legend.append('text')
        .attr('x', svgDOM.offsetWidth - 193)
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

    }
  
    // Listen for selected university from map and update
    // the chart accordingly
    if (map !== null) {
      map.addEventListener('selectNewMarker', (event) => { 
        console.log('Selected University Changed');
        // Update the hierarchical sunburst chart with new data
        selectedUniversity = event.detail.props().name;

        if (this.type !== 'StackUoa') {
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
        } else {
          this.reload(
            selectedUniversity,
            uoa,
            orgData,
            dataManager.getUoaByUniversity(orgData, selectedUniversity),
            'StackUoa'
          );
        }
      }, false);
    }

    if (this.type !== 'ShowUniversity') {
      d3.selectAll('.tick text')._groups[0].forEach((el) => {
        if (el.innerHTML === selectedUniversity) {
          // Highlight selected university name
          d3.selectAll('.tick text')
            .attr('transform', 'scale(1)')
            .style('opacity', 0.25);
          d3.select(el)
            .attr('transform', 'scale(1.5)')
            .style('opacity', 1)
            .style('transition', 'all 0.5s');  
        }
      });
    }

    // Listen for selected unit of assessment from stack and update
      // the chart accordingly
      if (force !== null) {
        force.addEventListener('selectForceUoa', (event) => { 
          console.log('Selected UoA Changed');
          // Update the hierarchical sunburst chart with new data
          uoa = event.detail.props().key;
          this.reload(
            selectedUniversity,
            uoa,
            orgData,
            dataManager.getLocationByUoA(orgData, uoa),
            'ShowUoA'
          );
        }, false);
      }

    if (this.type !== 'ShowUniversity' && this.type !== 'StackUoa') {

      // Right axis with quartiles
      // https://bl.ocks.org
      g.append('g')
        .attr('class','axis quartiles')
        .attr('transform', 'translate(' + (svgDOM.offsetWidth / 1.125) +
        ',' + (15 - svgDOM.offsetHeight / 100) + ')')
        .call(d3.axisRight(scaleY)
            .tickValues(uniQuartiles)
        );
    
      d3.selectAll('.quartiles .tick text')
        .text((d) => {
          let result = '';
          if (d === uniQuartiles[0]) {
            result = displayedResults[0];
          } else if (d === uniQuartiles[1]) {
            result = displayedResults[1];
          } else if (d === uniQuartiles[2]) {
            result = displayedResults[2];
          }
            
          return result;
        })
        .style('opacity', 1);

    }


    /*------------------------------------------------------*/

    /*
     * Private functions
     */

    // http://bl.ocks.org/zikes/4285872
    // Calculate the kth q-quantile of a set of numbers in an array.
    // As per http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population
    function quantile (arr, k, q) {
      var sorted, count, index;

      if(k === 0) return Math.min.apply(null, arr);

      if (k === q) return Math.max.apply(null, arr);

      sorted = arr.slice(0);
      sorted.sort(function (a, b) { return a - b; });
      count = sorted.length;
      index = count * k / q;

      if (index % 1 === 0) return 0.5 * sorted[index - 1] + 0.5 * sorted[index];

      return sorted[Math.floor(index)];
    }

    // Handle mouse click events
    function handleClick(d) {
      // Create a new custom event and listen to it in the main module
      const selectNewUoa = new CustomEvent('selectNewUoa', { detail: {
          props: () => d
        }
      });
      svgDOM.dispatchEvent(selectNewUoa);

      // Visual effects
      newData.forEach((item) => {
        d3.selectAll('.tick text')._groups[0].forEach((el) => {
          if (el.innerHTML === d.data.Uoa) {
            // Highlight selected university name
            d3.selectAll('.tick text')
              .attr('transform', 'scale(1)')
              .style('opacity', 0.25);
            d3.select(el)
              .attr('transform', 'scale(1.5)')
              .style('opacity', 1)
              .style('transition', 'all 0.5s');  
          }
        });
      });
    }

  }

  /*
   * Function to reload the map with new dataset
   */
  reload(newUni, newUoa, orgData, data, type) {
    this.selectedUni = newUni;
    this.selectedUoa = newUoa;
    console.log('Reloading the chart using a new dataset');

    // Rearrange the dataset
    this.originalData = orgData;
    this.data = data;
    this.type = type;
    this.createChart();
  }

}