/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*    File Description: Populate Selection with universities from dataset    */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 15 July 2018                                 */
/*****************************************************************************/

export default function populateCities(data) {
  let selector = document.getElementById('selector-city');
  
  data.forEach((item) => {
    let option = document.createElement('option');
    option.text = item;
    option.value = item;
    selector.appendChild(option);
  });
}