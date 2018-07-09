/***********************************************************************************/
/*                   Name: Data Visualization Coursework - F21DV                   */
/*   File Description: Module to compare, filter and combine different datasets    */
/*                              Author: Heba El-Shimy                              */
/*                             Email: he12@hw.ac.uk                                */
/*                              Date: 28 June 2018                                 */
/*              References: LearnJSData.com - Combining Data                       */
/*                     http://learnjsdata.com/combine_data.html                    */
/*                         Student contribution: 70%                               */
/*                          External Resources: 30%                                */
/***********************************************************************************/

// Import D3js library
import * as d3 from 'd3';

// Import array join code snippet
import join from '../helpers/join';
import onlyUnique from '../helpers/getUnique';

export default class DataManager {

	constructor() {
		this.dataset = [];
	}

	mergeDatasets(mainData, extraData) {

		var groupBy = function(xs, key) {
			return xs.reduce(function(rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
				return rv;
			}, {});
		};
		//console.log(groupBy(mainData, 'Profile'));

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
					},
					'Outputs': {
						'FourStar': mainData.Profile === 'Outputs' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Outputs' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Outputs' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Outputs' ? mainData['1*'] : 0,
					},
					'Environment': {
						'FourStar': mainData.Profile === 'Environment' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Environment' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Environment' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Environment' ? mainData['1*'] : 0,
					},
					'Impact': {
						'FourStar': mainData.Profile === 'Impact' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Impact' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Impact' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Impact' ? mainData['1*'] : 0,
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
					},
					'Outputs': {
						'FourStar': mainData.Profile === 'Outputs' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Outputs' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Outputs' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Outputs' ? mainData['1*'] : 0,
					},
					'Environment': {
						'FourStar': mainData.Profile === 'Environment' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Environment' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Environment' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Environment' ? mainData['1*'] : 0,
					},
					'Impact': {
						'FourStar': mainData.Profile === 'Impact' ? mainData['4*'] : 0,
						'ThreeStar': mainData.Profile === 'Impact' ? mainData['3*'] : 0,
						'TwoStar': mainData.Profile === 'Impact' ? mainData['2*'] : 0,
						'OneStar': mainData.Profile === 'Impact' ? mainData['1*'] : 0,
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

	loadAllUoAs(data) {
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

	getOverallScoreByUoA(data) {
		let nestedData = d3.nest()
			.key((d) => {
				return d.UOA_Name;
			})
			.key((d) => {
				return d.InstitutionName;
			})
			.rollup((values) => {
				return {
					OneStar: d3.sum(values, (item) => { return item.Overall.OneStar; }),
					TwoStar: d3.sum(values, (item) => { return item.Overall.TwoStar; }),
					ThreeStar: d3.sum(values, (item) => { return item.Overall.ThreeStar; }),
					FourStar: d3.sum(values, (item) => { return item.Overall.FourStar; })
				};
			})
			.entries(data);

		//return nestedData;
		console.log(nestedData);
	}

	getLocationByUoA(data, uoa, stars) {
		let filtered = data.filter((item) => {
			return item.UOA_Name === uoa;
		});

		let nestedData = d3.nest()
			.key((d) => {
				return d.InstitutionName;
			})
			.rollup((values) => {
				return {
					Lat: d3.mean(values, (d) => { return d.Lat; }),
					Lng: d3.mean(values, (d) => { return d.Lng; }),
					Score: d3.max(values, (d) => { return d.Overall[stars]; })
				};
			})
			.entries(filtered);

		return nestedData;
		//console.log(nestedData);

	}

}
