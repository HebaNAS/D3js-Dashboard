/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*                  File Description: Import all modules                     */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 25 June 2018                                 */
/*****************************************************************************/

import DataManager from './models/data';
import toggleMenu from './views/menu-toggle';

// Instantiate a new Data Manager Class
let dataManager = new DataManager();

console.log(dataManager.loadDatasets('../_data/learning-providers-plus.csv',
'../_data/REF2014_Results.csv'));

// Import Menu Toggle Functionality
toggleMenu(window, document);