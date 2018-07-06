/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*                  File Description: Import all modules                     */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 25 June 2018                                 */
/*****************************************************************************/

import * as d3 from 'd3';

import DataManager from './models/data';
import toggleMenu from './views/menu-toggle';

// Instantiate a new Data Manager Class
let dataManager = new DataManager();

function startApplication() {

  // Get current server's url and port to pass them to d3.csv request function
  let hostUrl = location.href.substring(0, location.href.lastIndexOf("/") + 1);
    
  // Start loading our datasets in parallel using D3-queue,
  // then create a callback for the function responsible
  // for building the dashboard
  d3.queue()
  .defer(d3.csv, 'https://raw.githubusercontent.com/HebaNAS/D3js-Dashboard/master/_data/REF2014_Results.csv')
  .defer(d3.csv, 'https://raw.githubusercontent.com/HebaNAS/D3js-Dashboard/master/_data/learning-providers-plus.csv')
  .await((err, mainData, extraData) => {
    // After waiting for datasets to load, do cleaning and pass data for
    // creating the dashboard
    dataManager.mergeDatasets(mainData, extraData);
    //createDashboard();
  });
}

startApplication();

// Import Menu Toggle Functionality
toggleMenu(window, document);