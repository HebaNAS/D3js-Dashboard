/***********************************************************************************/
/*                   Name: Data Visualization Coursework - F21DV                   */
/*  File Description: Data Manager Module to load and extract data from csv files  */
/*                              Author: Heba El-Shimy                              */
/*                             Email: he12@hw.ac.uk                                */
/*                              Date: 27 June 2018                                 */
/***********************************************************************************/

// Import D3js library
import * as d3 from 'd3';
export default class DataManager {

	constructor() {
		this.dataset = [];
		// Read contents as a string
		// Define variables to hold data
		// this.dataManagerObject = {};
		// this.dataset = [];
		// this.UoAFilter = null;
		// this.ProfileFilter = 'Overall';
		// this.FourStarFilter = null;
		// this.InstitutionFilter = null;
		// this.allUoas = [];
	}

	// Function to load data from csv files
	loadDataset(path) {
		let d = [];
		try {
			d3.csv(path, function(data) {
				d.push(data);
			});
			this.dataset = d;
			console.log(this.dataset);
		}
		catch (err) {
			console.log('Error', err);
		}
		return this.dataset;
	}

	// dataManagerObject.getAllUoAs = function(data) {
	// 	dataset = data;
	// 	let results = d3.nest()
	// 		.key(function(d) { return d.UOA_Name; })
	// 		.sortKeys(d3.ascending)
	// 		.entries(filteredData());

	// 	return results;
	// };

	// dataManagerObject.getAllUniversities = function(data) {
	// 	dataset = data;
		
	// 	let results = d3.nest()
	// 		.key(function(d) { return d.InstitutionName; })
	// 		.sortKeys(d3.ascending)
	// 		.entries(filteredData());

	// 	return results;
	// };

	// dataManagerObject.getUniversitiesByUoA = function(data) {
	// 	dataset = data;
		
	// 	let results = null;

	// 	return results;
	// };

	// dataManagerObject.setUoAFilter = function(UoA) {
	// 	if (UoAFilter == UoA) {
	// 		UoAFilter = UoA;
	// 	} else {
	// 		UoAFilter = null;
	// 	}
	// };

	// dataManagerObject.setProfileFilter = function(Profile) {
	// 	if (ProfileFilter == Profile) {
	// 		ProfileFilter = null;
	// 	} else {
	// 		ProfileFilter = Profile;
	// 	}
	// };

	// dataManagerObject.setFourStartFilter = function(FourStar) {
	// 	if (FourStarFilter == FourStar) {
	// 		FourStarFilter = null;
	// 	} else {
	// 		FourStarFilter = FourStar;
	// 	}
	// };

	// function filteredData() {
	// 	return dataset.filter(function(entry) {
	// 		return (UoAFilter === null || UoAFilter === entry.UOA_Name) &&
	// 		(ProfileFilter === null || ProfileFilter === entry.Profile) &&
	// 		(FourStarFilter === null || FourStarFilter === entry.FourStar);
	// 	});
	// }

  //return dataManagerObject;
}
