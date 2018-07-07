/*
 * Code Snippet provided by Stack Overflow
 * URL: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates
 * Adapted for use with this application's requirements
 */

// Create a function to return unique values of an array
export default function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}