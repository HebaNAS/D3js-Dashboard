/*
 * Code Snippet provided by LearnJSData.com
 * URL: http://learnjsdata.com/combine_data.html
 * Adapted for use with this application's requirements
 */

// Define a function to lookup fields that are common between 2 datasets and return
// a new array containing only selected columns based on a predefined schema
export default function join (lookupTable, mainTable, mainKey, lookupKey, select) {
  
  let l = lookupTable.length;
  let m = mainTable.length;
  let lookupIndex = [];
  let output = [];

  // Loop through the dataset that has extra info we need to add to the main dataset (mainTable)
  for (let i = 0; i < l; i++) {
    let row = lookupTable[i];
    // Populate lookupIndex with the identifier field we need from lookupTable as the index
    lookupIndex[row[lookupKey]] = row;
  }

  for (let j = 0; j < m; j++) {
    // Pick up a row from the main dataset (mainTable)
    let y = mainTable[j];
    // Get the corresponding row from the dataset we want to add (lookupTable)
    let x = lookupIndex[y[mainKey]];
    // Select only the columns we need based on a predefined schema, provided in the
    // functions arguments, create a new array with the results.
    output.push(select(y, x));
  }

  return output;
}