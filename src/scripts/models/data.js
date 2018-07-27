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
						'FourStar': mainData.Profile === 'Overall' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Overall' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Overall' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Overall' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Overall' ? parseFloat(mainData.unclassified) : 0
					},
					'Outputs': {
						'FourStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Outputs' ? parseFloat(mainData.unclassified) : 0
					},
					'Environment': {
						'FourStar': mainData.Profile === 'Environment' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Environment' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Environment' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Environment' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Environment' ? parseFloat(mainData.unclassified) : 0
					},
					'Impact': {
						'FourStar': mainData.Profile === 'Impact' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Impact' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Impact' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Impact' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Impact' ? parseFloat(mainData.unclassified) : 0
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
						'FourStar': mainData.Profile === 'Overall' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Overall' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Overall' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Overall' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Overall' ? parseFloat(mainData.unclassified) : 0
					},
					'Outputs': {
						'FourStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Outputs' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Outputs' ? parseFloat(mainData.unclassified) : 0
					},
					'Environment': {
						'FourStar': mainData.Profile === 'Environment' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Environment' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Environment' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Environment' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Environment' ? parseFloat(mainData.unclassified) : 0
					},
					'Impact': {
						'FourStar': mainData.Profile === 'Impact' ? parseFloat(mainData['4*']) : 0,
						'ThreeStar': mainData.Profile === 'Impact' ? parseFloat(mainData['3*']) : 0,
						'TwoStar': mainData.Profile === 'Impact' ? parseFloat(mainData['2*']) : 0,
						'OneStar': mainData.Profile === 'Impact' ? parseFloat(mainData['1*']) : 0,
						'Unclassified': mainData.Profile === 'Impact' ? parseFloat(mainData.unclassified) : 0
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
	 * Function to extract all Universities from a given dataset
	 */
	loadAllUniversities(data) {

		// Create a variable to hold the filtered data which will only contain the uoa
		let filtered = [];
		
		// Loopt through the dataset to get all UoAs
		data.forEach((entry) => {
			filtered.push(entry.InstitutionName);
		});

		// Filter only unique values and remove duplicates
		filtered = [...new Set(filtered)]; 
		console.log('UoA count: ', filtered.length);

		return filtered;
	}

	/*
	 * Function to extract all Universities from a given dataset
	 */
	loadAllUniversitiesInCity(data, city) {

		// Create a variable to hold the filtered data which will only contain the uoa
		let filtered = [];
		
		// Loopt through the dataset to get all UoAs
		data.forEach((entry) => {
			if (entry.Town.toLowerCase() === city.toLowerCase()) {
				filtered.push(entry.InstitutionName);
			}
		});

		// Filter only unique values and remove duplicates
		filtered = [...new Set(filtered)]; 
		console.log('University count: ', filtered.length);

		return filtered;
	}

	/*
	 * Function to extract all Universities from a given dataset
	 */
	loadAllCities(data) {

		// Create a variable to hold the filtered data which will only contain the uoa
		let filtered = [];
		
		// Loopt through the dataset to get all UoAs
		data.forEach((entry) => {
			if (entry.Town !== '') {
				filtered.push(entry.Town.toLowerCase());
			}
		});

		// Filter only unique values and remove duplicates
		filtered = [...new Set(filtered.sort())]; 
		console.log('City count: ', filtered.length);

		return filtered;
	}

	/*
	 * Function to get locations of institutions given a specific Unit of Assessment
	 * and selecting a tier of score
	 */
	getLocationByUoA(data, uoa) {
		
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
					Uoa: () => { return uoa; },
					City: (values, (d) => { return d.Town; }),
					Name: d3.max(values, (d) => { return d.InstitutionName; }),
					Overall4Score: d3.max(values, (d) => { return d.Overall.FourStar; }),
					Overall3Score: d3.max(values, (d) => { return d.Overall.ThreeStar; }),
					Overall2Score: d3.max(values, (d) => { return d.Overall.TwoStar; }),
					Overall1Score: d3.max(values, (d) => { return d.Overall.OneStar; }),
					OverallUCScore: d3.max(values, (d) => { return d.Overall.Unclassified; }),
					Environment4Score: d3.max(values, (d) => { return d.Environment.FourStar; }),
					Environment3Score: d3.max(values, (d) => { return d.Environment.ThreeStar; }),
					Environment2Score: d3.max(values, (d) => { return d.Environment.TwoStar; }),
					Environment1Score: d3.max(values, (d) => { return d.Environment.OneStar; }),
					EnvironmentUCScore: d3.max(values, (d) => { return d.Environment.Unclassified; }),
					Impact4Score: d3.max(values, (d) => { return d.Impact.FourStar; }),
					Impact3Score: d3.max(values, (d) => { return d.Impact.ThreeStar; }),
					Impact2Score: d3.max(values, (d) => { return d.Impact.TwoStar; }),
					Impact1Score: d3.max(values, (d) => { return d.Impact.OneStar; }),
					ImpactUCScore: d3.max(values, (d) => { return d.Impact.Unclassified; }),
					Outputs4Score: d3.max(values, (d) => { return d.Outputs.FourStar; }),
					Outputs3Score: d3.max(values, (d) => { return d.Outputs.ThreeStar; }),
					Outputs2Score: d3.max(values, (d) => { return d.Outputs.TwoStar; }),
					Outputs1Score: d3.max(values, (d) => { return d.Outputs.OneStar; }),
					OutputsUCScore: d3.max(values, (d) => { return d.Outputs.Unclassified; })
				};
			})
			.entries(filtered);

		return nestedData;
	}

	/*
	 * Function to get units of assessment given a specific university
	 * and selecting a tier of score
	 */
	getUoaByUniversity(data, uni) {
		
		// Create a variable to hold filtered data which will contain only universities
		// that provide research in the selected area (Unit of Assessment)
		let filtered = data.filter((item) => {
			return item.InstitutionName === uni;
		});

		// Create a variable to hold the array return from the extraction operation,
		// using d3 nest to reshape our data into key, value pairs and return only
		// the university (institution) name, Location coordinates (Lat, Lng) and 
		// score fields
		let nestedData = d3.nest()
			// Set our key to the university name
			.key((d) => {
				return d.UOA_Name;
			})
			// Perform a calculation on the returned values
			.rollup((values) => {
				return {
					Uoa: d3.max(values, (d) => { return d.UOA_Name; }),
					City: (values, (d) => { return d.Town; }),
					Overall4Score: d3.max(values, (d) => { return d.Overall.FourStar; }),
					Overall3Score: d3.max(values, (d) => { return d.Overall.ThreeStar; }),
					Overall2Score: d3.max(values, (d) => { return d.Overall.TwoStar; }),
					Overall1Score: d3.max(values, (d) => { return d.Overall.OneStar; }),
					OverallUCScore: d3.max(values, (d) => { return d.Overall.Unclassified; }),
					Environment4Score: d3.max(values, (d) => { return d.Environment.FourStar; }),
					Environment3Score: d3.max(values, (d) => { return d.Environment.ThreeStar; }),
					Environment2Score: d3.max(values, (d) => { return d.Environment.TwoStar; }),
					Environment1Score: d3.max(values, (d) => { return d.Environment.OneStar; }),
					EnvironmentUCScore: d3.max(values, (d) => { return d.Environment.Unclassified; }),
					Impact4Score: d3.max(values, (d) => { return d.Impact.FourStar; }),
					Impact3Score: d3.max(values, (d) => { return d.Impact.ThreeStar; }),
					Impact2Score: d3.max(values, (d) => { return d.Impact.TwoStar; }),
					Impact1Score: d3.max(values, (d) => { return d.Impact.OneStar; }),
					ImpactUCScore: d3.max(values, (d) => { return d.Impact.Unclassified; }),
					Outputs4Score: d3.max(values, (d) => { return d.Outputs.FourStar; }),
					Outputs3Score: d3.max(values, (d) => { return d.Outputs.ThreeStar; }),
					Outputs2Score: d3.max(values, (d) => { return d.Outputs.TwoStar; }),
					Outputs1Score: d3.max(values, (d) => { return d.Outputs.OneStar; }),
					OutputsUCScore: d3.max(values, (d) => { return d.Outputs.Unclassified; })
				};
			})
			.entries(filtered);

		return nestedData;
	}

	/*
	 * Function to get locations of institutions given a specific Unit of Assessment and a City
	 */
	getLocationByCity(data, city) {
		
		// Create a variable to hold filtered data which will contain only universities
		// that provide research in the selected area (Unit of Assessment) in the selected city
		let filtered = data.filter((item) => {
			return item.Town.toLowerCase() === city.toLowerCase();
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
					MeanScore: d3.mean(values, (d) => {
						if (d.Profile === 'Overall') {
							return parseFloat(d.Overall.FourStar);
						}
					}),
					Overall4Score: d3.max(values, (d) => { return d.Overall.FourStar; }),
					Uoa: () => {
						let uoas = [];
						values.filter((d) => { 
							uoas.push(d.UOA_Name);
						});
						return [...new Set(uoas)];
					},
					City: city,
				};
			})
			.entries(filtered);
		
		return nestedData;
	}

	/*
	 * Reformat our data into a form that could be understood by
   * d3's geoPath method
	 */
	reformatDataAsGeoJson(data, map) {
		data.forEach((d) => {
			if (d.type === undefined && map !== null && map !== undefined) {
				d.type = 'Feature';
				d.geometry = {};
				d.properties = {};
				d.properties.cartisan = {};
				d.properties.name = d.key;
				d.properties.city = d.value.City;
				d.properties.uoas = d.value.Uoa();
				d.properties.scores = {};
				d.properties.scores.mean = d.value.MeanScore;
				d.properties.scores.overall = {};
				d.properties.scores.overall.fourstar = d.value.Overall4Score;
				d.properties.scores.overall.threestar = d.value.Overall3Score;
				d.properties.scores.overall.twostar = d.value.Overall2Score;
				d.properties.scores.overall.onestar = d.value.Overall1Score;
				d.properties.scores.overall.unclassified = d.value.OverallUCScore;
				d.properties.cartisan.x =
					map.latLngToLayerPoint(new L.LatLng(d.value.Lat, d.value.Lng)).x;
				d.properties.cartisan.y =
					map.latLngToLayerPoint(new L.LatLng(d.value.Lat, d.value.Lng)).y;
				d.geometry.type = 'Point';
				d.geometry.coordinates = [d.value.Lat, d.value.Lng];
				delete d.key;
				delete d.value;
			} else {
				d.type = 'Feature';
				d.geometry = {};
				d.properties = {};
				d.properties.cartisan = {};
				d.properties.name = d.key;
				d.properties.city = d.value.City;
				d.properties.uoas = d.value.Uoa();
				d.properties.scores = {};
				d.properties.scores.mean = d.value.MeanScore;
				d.properties.scores.overall = {};
				d.properties.scores.overall.fourstar = d.value.Overall4Score;
				d.properties.scores.overall.threestar = d.value.Overall3Score;
				d.properties.scores.overall.twostar = d.value.Overall2Score;
				d.properties.scores.overall.onestar = d.value.Overall1Score;
				d.properties.scores.overall.unclassified = d.value.OverallUCScore;
				d.geometry.type = 'Point';
				d.geometry.coordinates = [d.value.Lat, d.value.Lng];
				delete d.key;
				delete d.value;
			}
		});
		
		return data;
	}

	/*
	 * Reformat our data into a form that could be understood by
   * d3's geoPath method
	 */
	reformatData(data) {
		if (data[0] !== undefined || data !== []) {
			try {
				data[0].values.forEach((item) => {
					item.values.push({'key': '4*', 'value': parseFloat(item.values[0]['4*'])});
					item.values.push({'key': '3*', 'value': parseFloat(item.values[0]['3*'])});
					item.values.push({'key': '2*', 'value': parseFloat(item.values[0]['2*'])});
					item.values.push({'key': '1*', 'value': parseFloat(item.values[0]['1*'])});
					item.values.push({'key': 'unclassified', 'value': parseFloat(item.values[0].unclassified)});
				});
				data[0].values.forEach((item) => {
					item.values.shift();
					if (item.values[0]['Institution name'] !== undefined) {
						item.values.shift();
					}
				});
			}
			catch(err) {
				console.log('Please try another selection');
			}
		}

		return data;
	}

	/*
	 * Reformat our data into a form that could be understood by
   * d3's geoPath method
	 */
	reformatUoaData(data) {
		if (data !== undefined || data !== []) {
			try {
				data.forEach((el) => {
					el.values.forEach((item) => {
						item.values.push({'key': '4*', 'value': parseFloat(item.values[0]['4*'])});
						item.values.push({'key': '3*', 'value': parseFloat(item.values[0]['3*'])});
						item.values.push({'key': '2*', 'value': parseFloat(item.values[0]['2*'])});
						item.values.push({'key': '1*', 'value': parseFloat(item.values[0]['1*'])});
						item.values.push({'key': 'unclassified', 'value': parseFloat(item.values[0].unclassified)});
					});
				});
				data.forEach((el) => {
					el.values.forEach((item) => {
						item.values.shift();
						if (item.values[0]['Unit of assessment name'] !== undefined) {
							item.values.shift();
						}
					});
				});
			}
			catch(err) {
				console.log('Please try another selection');
			}
		}

		return data;
	}

	/*
	 * Function to reconstruct the flat dataset into a JSON like
	 * structure containing a root of a selected unit of assessments which
	 * will include all universities having that uoa and nested inside the
	 * assessment categories and scores
	 */
	createUniversitiesPerformanceHierarchy(data, selectedUoa, selectedUni) {
		// Create an empty array to hold universities filtered out
		// according to Unit of assessment
		let universities = [];
		
		// Only add universities that have the selected department
    data.forEach((item) => {
			if (item['Unit of assessment name'] === selectedUoa &&
					item['Institution name'] === selectedUni) {
        universities.push(item);
      }
		});

		// Start nesting the data into a hierarchical structure
		const nestedData = d3.nest()
			.key((d) => selectedUni)
			.key((d) => d.Profile)
			.entries(universities);

		return nestedData;
	}

	/*
	 * Function to reconstruct the flat dataset into a JSON like
	 * structure containing a root of a selected university which
	 * will include all units of assessment nested inside the
	 * assessment categories and scores
	 */
	createUoaPerUniPerformanceHierarchy(data, selectedUni) {
		// Create an empty array to hold universities filtered out
		// according to Unit of assessment
		let uoas = [];
		
		// Only add universities that have the selected department
    data.forEach((item) => {
			if (item['Institution name'] === selectedUni) {
        uoas.push(item);
      }
		});

		// Start nesting the data into a hierarchical structure
		const nestedData = d3.nest()
			.key((d) => d['Unit of assessment name'])
			.key((d) => d.Profile)
			.entries(uoas);

		return nestedData;
	}

}
