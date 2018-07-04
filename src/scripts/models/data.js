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
  async loadDatasets() {

		// Create a temporary empty array to hold loaded data
		let d = [];

		// Create a variable to hold the queue
		let q = d3.queue();

		// Loop through the arguments array to get file paths and add them to th queue
		for (var i = 0; i < arguments.length; i++) {
			q.defer(d3.csv, arguments[i]);
		}

		// Start loading data
		d = q.awaitAll(mergeDatasets)._data;
	
		// Filter and join Datasets on UKPRN Field
		function mergeDatasets(error, data) {

			// Check for errors
			if (error) { console.log('Error: ', error); }
			
			console.log(data);
			// Create an empty array to hold filtered data
			let filteredData = [];
			
			// Create temporary names for input data array for ease of reading code
			let dataset1 = data[0];
			let dataset2 = data[1];

			console.log(dataset1);

			// Create an empty array to hold merged data
			let mergedData = [];

			// Create a lookup table 
			let index = [];

			// Variables to hold fields in both datasets we need for comparison
			let primaryKey = 'Institution code (UKPRN)';
			let foreignKey = 'UKPRN';
	
			// Loop through both datasets and remove records in REF dataset
			// that don't have a corresponding entry in learning providers dataset
			// this step is to make sure that when merging datasets, for a given field
			// in a dataset, we will always have a corresponding entry in the other
			// and that we don't get any 'undefined' values
			for (let i=0; i<dataset2.length; i++) {
				for (let j=0; j<dataset1.length; j++) {
					if (dataset1[j]['Institution code (UKPRN)'] == dataset2[i].UKPRN) {
						filteredData.push(dataset1[i]);
					}
				}   
			}
		
			// Create an object with the data and fields we need the final dataset to look like
			let selected = (filteredData, dataset2) => ({
				'UKPRN': filteredData['Institution code (UKPRN)'],
				'InstitutionName': filteredData['Institution name'],
				'SortOrder': filteredData['Institution sort order'],
				'MainPanel': filteredData['Main panel'],
				'UOA_Number': filteredData['Unit of assessment number'],
				'UOA_Name': filteredData['Unit of assessment name'],
				'Profile': filteredData.Profile,
				'FTEA_Submitted': filteredData['FTE Category A staff submitted'],
				'FourStar': filteredData['4*'],
				'ThreeStar': filteredData['3*'],
				'TwoStar': filteredData['2*'],
				'OneStar': filteredData['1*'],
				'Building': dataset2.BUILDING_NAME_NUMBER,
				'Street': dataset2.STREET_NAME,
				'Town': dataset2.TOWN,
				'Postcode': dataset2.POSTCODE,
				'Url': dataset2.WEBSITE_URL,
				'Lng': dataset2.LONGITUDE,
				'Lat': dataset2.LATITUDE,
				'Easting': dataset2.EASTING,
				'Northing': dataset2.NORTHING
			});
		
			// Create a lookup table to grab selected fields
			// Loop through second dataset items
			for (let i = 0; i < dataset2.length; i++) { 
				let row = dataset2[i];

				// Create an index for lookup table
				// From each row, grab the 'UKPRN' field only
				index[row[foreignKey]] = row;
			}

			// Loop through filtered dataset
			for (let j = 0; j < filteredData.length; j++) {
				let row1 = filteredData[j];
				
				// Get the corresponding row from the lookup table
				let row2 = index[row1[primaryKey]];

				// Select only the columns we need and specified in the schema
				// of the 'select' object we created and push found values to mergedData array
				mergedData.push(selected(row1, row2)); 
			}

			console.log(mergedData);
			return mergedData;
		}
		
		return this.dataset;
	}

}
