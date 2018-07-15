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
import { mainEca } from './templates/eca-phd';
import { universityManagement } from './templates/university-management';
import { industryResearch } from './templates/industry-research';
import toggleMenu from './views/menu-toggle';
import Map from './views/map';
import populateSelections from './views/populateSelections';
import HBarChart from './views/hBarChart';

// Instantiate a new Data Manager Class
const dataManager = new DataManager();

// Create a function where we call all other modules and start the application
function startApplication() {

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
    
    // Router, shows dashboard content relevant to category selected from navigation
    // Get nav elements from the DOM
    const ecaPhd = document.getElementsByClassName('header__nav-item')[0].childNodes[1],
    universityMgmt = document.getElementsByClassName('header__nav-item')[1].childNodes[1],
    industryResrch = document.getElementsByClassName('header__nav-item')[2].childNodes[1];

    const navArr = [ecaPhd, universityMgmt, industryResrch];

    // Show Early career academics and PhDs by default as the landing page
    let main = mainEca;
    let mainDOM = document.querySelector('main');
    mainDOM.innerHTML = main;
    mainDOM.setAttribute('id', 'eca-phd');

    // Create relevant dashboard
    createDashboardEca(dataset);

    // Highlight active nav item
    navArr.forEach((navItem) => {

      // Listen for click event on navigation items
      navItem.addEventListener('click', (event) => {
        // Prevent link default action
        event.preventDefault();

        // Get the route of the clicked navigation item
        let href = navItem.href.split('/');
        let dashboard = href[href.length - 1];
        let elements = navItem.parentElement.parentElement.children;

        // Highlight the selected category by adding an active class on the
        // corresponding navigation item 
        for (let i = 0; i <= 2; i++) {
          if (elements[i].classList.contains('active')) {
            elements[i].classList.remove('active');
          }
        }
        navItem.parentElement.classList.add('active');

        // Main routing functionality
        // Early Career Academics & PhDs Dashboard
        if (dashboard === 'eca-phd') {
          main = mainEca;
          mainDOM.innerHTML = main;
          mainDOM.setAttribute('id', 'eca-phd');
          createDashboardEca(dataset);
        } 
        // University Management Dashboard
        else if (dashboard === 'university-management') {
          main = universityManagement;
          mainDOM.innerHTML = main;
          mainDOM.setAttribute('id', 'um');
          createDashboardUm(dataset);
        }
        // Industry Collaborators and Research Strategists Dashboard
        else if (dashboard === 'industry-research') {
          main = industryResearch;
          mainDOM.innerHTML = main;
          mainDOM.setAttribute('id', 'ir');
          createDashboardEca(dataset);
        }
      });
    });
  });
}

// Create a function to start drawing the dashboard and visualizations
// for Early Career Academics & PhDs
function createDashboardEca(data) {
  
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

// Create a function to start drawing the dashboard and visualizations
// for Early Career Academics & PhDs
function createDashboardUm(data) {
  
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

}

// Start the application
startApplication();

// Import Menu Toggle Functionality
toggleMenu(window, document);
