import DataManager from '../models/data';

export default function loadData() {
  let filteredData = [];

	const dataManager = new DataManager();
	let dataset = [];

	dataset[0] = dataManager.loadDataset('../_data/REF2014_Results.csv') ||
								dataManager.loadDataset
								('https://github.com/HebaNAS/D3js-Dashboard/tree/master/_data/REF2014_Results.csv');
	dataset[1] = dataManager.loadDataset('../_data/learning-providers-plus.csv') ||
								dataManager.loadDataset('https://github.com/HebaNAS/D3js-Dashboard/tree/master/_data/learning-providers-plus.csv');

	console.log(dataset);

	// function loadExtraDataset() {
	// 	dataManager.loadDataset('../../datasets/learning-providers-plus.csv',
	// 	function(error) {
	// 		console.log('Error', error);
	// 	},
	// 	function(data) {
	// 		dataset[1] = data;
	// 		compareDatasets();
	// 	});
	// }

	// function compareDatasets() {
	// 	let filteredData = [];
	// 	let firstDataset = dataset[0];
	// 	let secondDataset = dataset[1];

	// 	for (let i=0; i<secondDataset.length; i++) {
	// 		for (let j=0; j<firstDataset.length; j++) {
	// 			if (firstDataset[j]['Institution code (UKPRN)'] == secondDataset[i]['UKPRN']) {
	// 				filteredData.push(firstDataset[i]);
	// 			}
	// 		}   
	// 	}

	// 	dataset[0] = filteredData;
	// 	joinDatasets();
	// }

	// function joinDatasets(callback) {
	// 	let filteredData = dataset[0];
	// 	let secondDataset = dataset[1];
	// 	let primaryKey = 'Institution code (UKPRN)';
	// 	let foreignKey = 'UKPRN';
	
	// 	let index = [];
	// 	let cleanedData = [];
	
	// 	let select = function(filteredData, secondDataset) {
	// 		return {
	// 			'UKPRN': filteredData['Institution code (UKPRN)'],
	// 			'InstitutionName': filteredData['Institution name'],
	// 			'SortOrder': filteredData['Institution sort order'],
	// 			'MainPanel': filteredData['Main panel'],
	// 			'UOA_Number': filteredData['Unit of assessment number'],
	// 			'UOA_Name': filteredData['Unit of assessment name'],
	// 			'Profile': filteredData.Profile,
	// 			'FTEA_Submitted': filteredData['FTE Category A staff submitted'],
	// 			'FourStar': filteredData['4*'],
	// 			'ThreeStar': filteredData['3*'],
	// 			'TwoStar': filteredData['2*'],
	// 			'OneStar': filteredData['1*'],
	// 			'Building': secondDataset.BUILDING_NAME_NUMBER,
	// 			'Street': secondDataset.STREET_NAME,
	// 			'Town': secondDataset.TOWN,
	// 			'Postcode': secondDataset.POSTCODE,
	// 			'Url': secondDataset.WEBSITE_URL,
	// 			'Lng': secondDataset.LONGITUDE,
	// 			'Lat': secondDataset.LATITUDE,
	// 			'Easting': secondDataset.EASTING,
	// 			'Northing': secondDataset.NORTHING
	// 		};
	// 	};
	
	// 	for (let i = 0; i < secondDataset.length; i++) { // loop through l items
	// 			let row = secondDataset[i];
	// 			index[row[foreignKey]] = row; // create an index for lookup table
	// 	}
	// 	for (let j = 0; j < filteredData.length; j++) { // loop through m items
	// 			let y = filteredData[j];
	// 			let x = index[y[primaryKey]]; // get corresponding row from lookupTable
	// 			cleanedData.push(select(y, x)); // select only the columns you need
	// 	}

  //   dataset = cleanedData;

}