/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*       File Description: Create a horizontal bar chart given a dataset     */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                         Date: 7 July 2018                                 */
/*****************************************************************************/

// Import d3 library
import * as d3 from 'd3';

// Create a function to draw a horizontal barchart giving a dataset and a DOM
// element as arguments
export default class HBarChart {

  // Create the constructor function and define variables
  constructor(data, DOMElement, width, height) {
    this.data = data;
    this.DOMElement = DOMElement;
    this.svgWidth = width;
    this.svgHeight = height;
    this.svg = {};
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleOrdinal();
  }

  // Append svg to the selected DOM Element and set its width and height
  appendSvg() {
    
    // Append the svg with the given options
    d3.select(this.DOMElement).append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);
  }

  updateScales(data) {
    console.log('Updating scales...');

    //console.log(this.xScale);
		this.xScale.domain([0, d3.max(data, (d) => { return d.UOA_Name; })])
      .range([0, this.svgHeight - 20 * 2]);
      
    this.yScale.domain(data.map((d) => { console.log(d3.sum(() => {
      d.OneStar, d.TwoStar, d.ThreeStar, d.FourStar
      })); 
    }))
			//.paddingInner(0.1)
			.range([20, this.svgWidth - 20]);
  }

  render(data) {
    console.log('Rendering...');
    console.log(data);
    // if (this.svg) {
    //   this.svg.attr("width", this.svgWidth)
    //           .attr("height", this.svgHeight);
    // }
       
    //this.updateScales(data);
    this.svg = d3.select(this.DOMElement).selectAll('svg');
    // GUP
		let bars = this.svg.selectAll('rect')
      .data(data, (d) => { return d.key; });

    // enter 
    bars.enter().append('rect')
      .attr('x', 0)
      .attr('width', 50)
      .attr('height', 10)
      .attr('y', 0)
      .attr('height', 100);
  }
}