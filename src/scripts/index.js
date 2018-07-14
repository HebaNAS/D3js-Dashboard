/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*       File Description: Import all modules and start the application      */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 25 June 2018                                 */
/*****************************************************************************/

// Import d3 library from node_modules
import * as d3 from 'd3';

// Import this application's modules
import DataManager from './models/data';
import toggleMenu from './views/menu-toggle';
import Map from './views/map';
import populateSelections from './views/populateSelections';
import HBarChart from './views/hBarChart';

// Instantiate a new Data Manager Class
const dataManager = new DataManager();

// Create a function where we call all other modules and start the application
function startApplication() {

  // Get current server's url and port to pass them to d3.csv request function
  //let hostUrl = location.href.substring(0, location.href.lastIndexOf("/") + 1);

  // Start loading our datasets in parallel using D3-queue,
  // then create a callback for the function responsible
  // for building the dashboard
  d3.queue()
  .defer(d3.csv, 'https://raw.githubusercontent.com/HebaNAS/D3js-Dashboard/master/_data/REF2014_Results.csv')
  .defer(d3.csv, 'https://raw.githubusercontent.com/HebaNAS/D3js-Dashboard/master/_data/learning-providers-plus.csv')
  .await((err, mainData, extraData) => {
    // After waiting for datasets to load, do cleaning and pass data for
    // creating the dashboard
    let dataset = dataManager.mergeDatasets(mainData, extraData);
    
    createDashboard(dataset);
  });
}

// Create a function to start drawing the dashboard and visualizations
function createDashboard(data) {
  
  /*
   * Loading all Units os Assessment and use this for populating
   * select box which will control the whole layout and all the visualizations
   * on this page
   */
  // Load all Unit of Assessment options
  let uoas = dataManager.loadAllUoAs(data);

  // Populate the select box with the options
  populateSelections(uoas);

  // Get the current selection from the select box
  let selectBox = document.getElementById('selector');
  let selectedUoa = 'Allied Health Professions, Dentistry, Nursing and Pharmacy';

  /*
    * Creating the first visualization, which is a map of the UK,
    * with all the locations of the universities in a selected field (Unit
    * of Assessment) which is passed on as an argument from the selectbox
    */ 
   let mapMarkers = dataManager.getLocationByUoA(data, selectedUoa, 'FourStar');
    
   // Create the map
   const map = new Map(mapMarkers);
   map.createMap();
   map.render();

  // Listen for changes on the selectbox and get the selected value
  selectBox.addEventListener('change', (event) => {
    selectedUoa = selectBox.options[selectBox.selectedIndex].value;
    console.log(selectedUoa);

    // Reload the map with the new dataset
    map.reload(dataManager.getLocationByUoA(data, selectedUoa, 'FourStar'));
  });

  // Select DOM Element we will render the bar chart inside
  let uoaCard = document.getElementById('uoa-card');

  // Instantiate a new Horizontal Barchart Class with our desired specifications
  // passed in as parameters
  const hBarChart = new HBarChart(data, uoaCard, '100%', '100%');

  //dataManager.getOverallScoreByUoA(data);

  // Create a horizontal bar chart
  hBarChart.appendSvg();
  //hBarChart.render(scores);
}

// Call the function that starts all scripts
startApplication();

// Import Menu Toggle Functionality
toggleMenu(window, document);