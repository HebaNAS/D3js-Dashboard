/*****************************************************************************/
/*               Name: Data Visualization Coursework - F21DV                 */
/*            File Description: Mobile menu toggle functionality             */
/*   References: PureCSS - https://purecss.io/layouts/tucked-menu-vertical/  */
/*                        Author: Heba El-Shimy                              */
/*                        Email: he12@hw.ac.uk                               */
/*                        Date: 25 June 2018                                 */
/*                     Student Contribution: 20%                             */
/*                     Code from reference: 80%                              */
/*****************************************************************************/

export default function toggleMenu(window, document) {

  let menu = document.getElementById('mobile-menu');
  let button = document.getElementById('toggle');
  let WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange':'resize';
  
  function toggleMenu() {
    if (!menu.classList.contains('open')) {
      menu.style.display = 'flex';
      setTimeout(function() {
        menu.style.opacity = 1;
        menu.style.height = '200px';
      }, 0.02);
      //menu.style.maxHeight = '600px';
      menu.classList.add('open');
      button.classList.add('x');
    } else {
      menu.style.display = 'none';
      setTimeout(function() {
        menu.style.opacity = 0;
        menu.style.height = 0;
      }, 0.02);
      menu.classList.remove('open');
      button.classList.remove('x');
    }
  }

  function closeMenu() {
    if (menu.classList.contains('open')) {
        toggleMenu();
    }
  }
  
  button.addEventListener('click', function (e) {
      toggleMenu();
      e.preventDefault();
  });
  
  window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);

}