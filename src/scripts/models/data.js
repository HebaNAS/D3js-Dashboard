/***********************************************************************************/
/*                   Name: Data Visualization Coursework - F21DV                   */
/*   File Description: Module to compare, filter and combine different datasets    */
/*                              Author: Heba El-Shimy                              */
/*                             Email: he12@hw.ac.uk                                */
/*                              Date: 28 June 2018                                 */
/***********************************************************************************/

// Import D3js library
import * as d3 from 'd3';
export default class DataManager {

	constructor() {
		this.dataset = [];
	}

	// Function to load data from csv files
	loadDatasets() {

		// Create a temporary empty array to hold loaded data
		let d = [];

		// Create a variable to hold the queue
		let q = d3.queue();

		// Loop through the arguments array to get file paths and add them to th queue
		for (var i = 0; i < arguments.length; i++) {
			q.defer(d3.csv, arguments[i]);
		}

		// Start loading data
		this.dataset = q.awaitAll(function(error, data) {
			if (error) throw error;
			return data;
		})._data;

		return this.dataset;
	}

}
