/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*    File Description: Populate HTML Selection with options from dataset    */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 6 July 2018                                 */
/*****************************************************************************/

export default function populateSelections(data) {
  let selector = document.getElementById('selector');
  
  data.forEach((item) => {
    let option = document.createElement('option');
    option.text = item;
    option.value = item;
    selector.appendChild(option);
  });
}