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

export default class DataManager {

	constructor() {
		this.dataset = [];
	}

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
					'FTEA_Submitted': mainData['FTE Category A staff submitted'],
					'FourStar': mainData['4*'],
					'ThreeStar': mainData['3*'],
					'TwoStar': mainData['2*'],
					'OneStar': mainData['1*'],
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
					'FTEA_Submitted': mainData['FTE Category A staff submitted'],
					'FourStar': mainData['4*'],
					'ThreeStar': mainData['3*'],
					'TwoStar': mainData['2*'],
					'OneStar': mainData['1*'],
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

}
