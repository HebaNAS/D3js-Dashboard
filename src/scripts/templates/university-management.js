/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*  File Description: Dom constructing dashboard for university management   */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 15 July 2018                                 */
/*****************************************************************************/

export const universityManagement =
   `
    <p class=""></p>
    <p class=""></p>
    <p class=""></p>
    <p class=""></p>
    <p class=""></p>
    <p class=""></p>
    <div class="card-style" id="uoa-card"></div>
    <div class="card-style" id="graph">
      <div class="tooltip"></div>
      <span>Available Units of Assessment</span>
    </div>
    <div class="card-style" id="compare-uni">
      <div id="chart">
        <div class="tooltip-graph"></div>
        <div id="error">
          Please Select a Unit of Assessment to update the chart
        </div>
        <div id="explanation" style="visibility: visible;">
        </div>
      </div>
    </div>
    <p class=""></p>
    <p class=""></p>
    <form class="selector text-center">
      <label class="font-07 font-bold">University</label>
      <select id="selector">
      </select>
    </form>
    <p class=""></p>
    <p class=""></p>
    <p class=""></p>
  `;