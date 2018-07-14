/***********************************************************************************/
/*                   Name: Data Visualization Coursework - F21DV                   */
/*  File Description: Class to manage all functionality for extracting needed data */
/*                              Author: Heba El-Shimy                              */
/*                             Email: he12@hw.ac.uk                                */
/*                              Date: 28 June 2018                                 */
/*              References: LearnJSData.com - Combining Data                       */
/*                     http://learnjsdata.com/combine_data.html                    */
/*                         Student contribution: 90%                               */
/*                          External Resources: 10%                                */
/***********************************************************************************/

// Import D3js library
import * as d3 from 'd3';

// Import array join code snippet
import join from '../helpers/join';
import onlyUnique from '../helpers/getUnique';

export default class DataManager {

	// Create a constructor function with variables to work with
	constructor() {
		this.dataset = [];
	}

	/*
	 * Function to merge two datasets and return an object with only
	 * specific fields
	 */
	mergeDatasets(mainData, extraData) {

		// Define the schema of the final shape we need our dataset to look like after the merge
		const select = ((mainData, extraData) => {
			if (extraData !== undefined) {
				return ({
					'UKPRN': mainData['Institution code (UKPRN)'],
					'InstitutionName': mainData['Institution name'],
					'SortOrder': mainData['Institution sort order'],
					'MainPanel': mainData['Main panel'],
					'UOA_Number': mainData['Unit of assessment number'],
					'UOA_Name': mainData['Unit of assessment name'],
					'Profile': mainData.Profile,
					'Overall': {
						'FourStar': mainData.Profile === 'Overall' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Overall' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Overall' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Overall' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Overall' ? mainData.unclassified : 0
					},
					'Outputs': {
						'FourStar': mainData.Profile === 'Outputs' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Outputs' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Outputs' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Outputs' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Outputs' ? mainData.unclassified : 0
					},
					'Environment': {
						'FourStar': mainData.Profile === 'Environment' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Environment' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Environment' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Environment' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Environment' ? mainData.unclassified : 0
					},
					'Impact': {
						'FourStar': mainData.Profile === 'Impact' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Impact' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Impact' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Impact' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Impact' ? mainData.unclassified : 0
					},
					'FTEA_Submitted': mainData['FTE Category A staff submitted'],
					'Building': extraData.BUILDING_NAME_NUMBER,
					'Street': extraData.STREET_NAME,
					'Code': extraData.UKPRN,
					'Town': extraData.TOWN,
					'Postcode': extraData.POSTCODE,
					'Url': extraData.WEBSITE_URL,
					'Lng': extraData.LONGITUDE,
					'Lat': extraData.LATITUDE,
					'Easting': extraData.EASTING,
					'Northing': extraData.NORTHING,
					'ViewName': extraData.VIEW_NAME
					});
				} else {
				return ({
					'UKPRN': mainData['Institution code (UKPRN)'],
					'InstitutionName': mainData['Institution name'],
					'SortOrder': mainData['Institution sort order'],
					'MainPanel': mainData['Main panel'],
					'UOA_Number': mainData['Unit of assessment number'],
					'UOA_Name': mainData['Unit of assessment name'],
					'Profile': mainData.Profile,
					'Overall': {
						'FourStar': mainData.Profile === 'Overall' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Overall' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Overall' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Overall' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Overall' ? mainData.unclassified : 0
					},
					'Outputs': {
						'FourStar': mainData.Profile === 'Outputs' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Outputs' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Outputs' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Outputs' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Outputs' ? mainData.unclassified : 0
					},
					'Environment': {
						'FourStar': mainData.Profile === 'Environment' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Environment' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Environment' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Environment' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Environment' ? mainData.unclassified : 0
					},
					'Impact': {
						'FourStar': mainData.Profile === 'Impact' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Impact' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Impact' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Impact' ? mainData['1*'] : 0,
						'Unclassified': mainData.Profile === 'Impact' ? mainData.unclassified : 0
					},
					'FTEA_Submitted': mainData['FTE Category A staff submitted'],
					'Building': '',
					'Street': '',
					'Code': '',
					'Town': '',
					'Postcode': '',
					'Url': '',
					'Lng': '',
					'Lat': '',
					'Easting': '',
					'Northing': ''
				});
			}
		});

		// Merge the datasets
		this.dataset = join(extraData, mainData, 'Institution code (UKPRN)', 'UKPRN', select);

		// Write a message to the console that the data has been loaded and cleaned
		console.log('Data Loaded & Cleaned...');

		return this.dataset;
	}

	/*
	 * Function to extract all Units of assessment from a given dataset
	 */
	loadAllUoAs(data) {

		// Create a variable to hold the filtered data which will only contain the uoa
		let filtered = [];
		
		// Loopt through the dataset to get all UoAs
		data.forEach((entry) => {
			filtered.push(entry.UOA_Name);
		});

		// Filter only unique values and remove duplicates
		filtered = [...new Set(filtered)]; 
		console.log('UoA count: ', filtered.length);

		return filtered;
	}

	/*
	 * Function to extract all Universities and their scores given a specific
	 * unit of assessment
	 */
	getOverallScoreByUoA(data) {
		
		// Create a variable to hold the data and use d3 nest method to extract the data
		// and return it in the form of key, value pairs
		let nestedData = d3.nest()
			// Define our key as the Unit of Assessment name
			.key((d) => {
				return d.UOA_Name;
			})
			// Define another key, University Name to be, nested as a second level
			.key((d) => {
				return d.InstitutionName;
			})
			// Calculate the results of the previous extraction operations and return
			// data as an object of the five tiers of scores available in the dataset (4* - unclassified)
			// using d3 sum to loop over extracted array of values and doing a summation operation
			.rollup((values) => {
				return {
					OneStar: d3.sum(values, (item) => { return item.Overall.OneStar; }),
					TwoStar: d3.sum(values, (item) => { return item.Overall.TwoStar; }),
					ThreeStar: d3.sum(values, (item) => { return item.Overall.ThreeStar; }),
					FourStar: d3.sum(values, (item) => { return item.Overall.FourStar; }),
					Unclassified: d3.sum(values, (item) => { return item.Overall.Unclassified; }),
				};
			})
			.entries(data);

		//return nestedData;
		console.log(nestedData);
	}

	/*
	 * Function to get locations of institutions given a specific Unit of Assessment
	 * and selecting a tier of score
	 */
	getLocationByUoA(data, uoa, stars) {
		
		// Create a variable to hold filtered data which will contain only universities
		// that provide research in the selected area (Unit of Assessment)
		let filtered = data.filter((item) => {
			return item.UOA_Name === uoa;
		});

		// Create a variable to hold the array return from the extraction operation,
		// using d3 nest to reshape our data into key, value pairs and return only
		// the university (institution) name, Location coordinates (Lat, Lng) and 
		// score fields
		let nestedData = d3.nest()
			// Set our key to the university name
			.key((d) => {
				return d.InstitutionName;
			})
			// Perform a calculation on the returned values
			.rollup((values) => {
				return {
					Lat: d3.mean(values, (d) => { return d.Lat; }),
					Lng: d3.mean(values, (d) => { return d.Lng; }),
					Score: d3.max(values, (d) => { return d.Overall[stars]; })
				};
			})
			.entries(filtered);

		return nestedData;
	}

}
