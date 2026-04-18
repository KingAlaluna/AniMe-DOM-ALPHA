import {html} from '../data/config.js';


html.themeBtn.addEventListener('click', () => {
  html.themeBtn.classList.toggle('active');
  setTheme();
});


function setTheme() {
  const isTheme = html.themeBtn.classList.contains('active') ? 'dark' : 'light';
  
  html.html.dataset.theme = isTheme;
  localStorage.setItem('AniMeIsTheme', isTheme);
}


function checkTheme() {
  const theme = localStorage.getItem('AniMeIsTheme');
  
  if (theme) {
    html.themeBtn.classList.toggle('active', theme == 'dark');
  } else {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    html.themeBtn.classList.toggle('active', theme == 'dark');
  }
  
  setTheme();
}
checkTheme();
