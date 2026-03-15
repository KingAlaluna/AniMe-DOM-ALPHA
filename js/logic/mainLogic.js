//lib
import * as NavigoLib from 'https://esm.sh/navigo';

//critical
import {html, api, data} from '../data/config.js';
import {openTitle} from './page/animeViewing.js';
import {loadTab} from './filterAnime.js';

//no critical
import './menu.js';
import './renderAnimeLists.js';
import './filterAnime.js';
import './searchAnime.js';


// --- NAV ---
function switchTab(tab, btn) {
  data.currentTab = tab;
  html.tabBtn.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  html.searchInput.value = '';
  loadTab(tab);
}


function pageActive(page) {
  if (data.page != page) {
    data.page = page;
    
    html.searchInput.value = '';
    html.allPage.forEach(e => {
      e.style.display = 'none';
    });
    html[page].style.display = 'flex';
  }
}


// --- FETCH HELPERS ---
export async function apiFetch(endpoint) {
  const res = await fetch(endpoint || api.API);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function showError(msg) {
  html.errorBox.textContent = '⚠ ' + msg;
  html.errorBox.style.display = 'block';
  setTimeout(() => html.errorBox.style.display = 'none', 5000);
}

/*function setLoading() {
  //html.mainPage.innerHTML = '<div class="loader" id="loader"><div class="spinner"></div> Завантаження...</div>';
}*/


// utils
export function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}



//
//router
//
//console.log(window.Navigo); 
export const router = new NavigoLib.default('/index.html', { hash: true });

router.on({
  '/': () => {
    pageActive('mainPage');
    loadTab('updates');
  },
  
  '/animeView/:id': (match) => {
    pageActive('animeViewing');
    openTitle(match.data.id);
  },
  
  
  '/updates': () => {
    pageActive('mainPage');
    loadTab('updates');
  },
  
  '/genres-random': () => {
    pageActive('mainPage');
    loadTab('genres-random');
  },
  
  '/yesterday': () => {
    pageActive('mainPage');
    loadTab('yesterday');
  },
  
  '/today': () => {
    pageActive('mainPage');
    loadTab('today');
  },
  
  '/tomorrow': () => {
    pageActive('mainPage');
    loadTab('tomorrow');
  },
  
  '/scheduleWeek': () => {
    pageActive('mainPage');
    loadTab('scheduleWeek');
  },
  
}).resolve();

