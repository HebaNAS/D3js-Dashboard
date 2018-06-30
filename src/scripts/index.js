/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*                  File Description: Import all modules                     */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 25 June 2018                                 */
/*****************************************************************************/

//import DataManager from './models/data';
import loadData from './controllers/loadFilterDatasets';
import toggleMenu from './views/menu-toggle';
import * as d3 from 'd3';

// Load datasets
loadData();

// Import Menu Toggle Functionality
toggleMenu(window, document);