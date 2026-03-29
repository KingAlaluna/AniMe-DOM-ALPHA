//lib
import * as NavigoLib from 'https://esm.sh/navigo';

//critical
import {html, api, data} from '../data/config.js';
import {btnMapValue} from '../data/filter.js';
import {openTitle, videoConfigStart} from './page/animeViewing.js';
import {loadTab, anineFilter} from './filterAnime.js';
import {searchAnime} from './searchAnime.js';

//no critical
import './menu.js';
import './renderAnimeLists.js';


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
      //e.scrollTo(0, 0);
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


async function scheduleNow(type) {
  if (Object.keys(data.scheduleNow).length == 0) {
    const result = await apiFetch(api.scheduleNow);
    data.scheduleNow = await result;
    console.log('Теперішній розклад результат!!!', result);
  }
  pageActive('mainPage');
  loadTab(type);
}



//
//router
//
//console.log(window.Navigo);
const root = window.location.pathname;
export const router = new NavigoLib.default(root, { hash: true });

router.hooks({
  after: (match) => {
    videoConfigStart();
  }
});

router.on({
  '/': () => {
    pageActive('mainPage');
    loadTab('main');
  },
  
  '/search/:name': (match) => {
    pageActive('mainPage');
    searchAnime(match.data.name);
  },
  
  '/animeView/:id': (match) => {
    pageActive('animeViewing');
    openTitle(match.data.id);
  },
  
  
  '/updates': () => {
    pageActive('mainPage');
    loadTab('updates');
  },
  
  //жанри 
  '/genres-random': () => {
    pageActive('mainPage');
    loadTab('genres-random');
  },
  
  '/genres-all': () => {
    pageActive('mainPage');
    loadTab('genres-all');
  },
  
  
  
  '/yesterday': () => {
    scheduleNow('yesterday');
  },
  
  '/today': () => {
    scheduleNow('today');
  },
  
  '/tomorrow': () => {
    scheduleNow('tomorrow');
  },
  
  '/scheduleWeek': () => {
    pageActive('mainPage');
    loadTab('scheduleWeek');
  },
  
  
  //filters
  '/filters/:type/:value': (match) => {
    const type = match.data.type;
    const value = match.data.value;
    const name = type != 'years' ? btnMapValue[type].get(isNaN(value) ? value : Number(value)) : null;
    
    pageActive('mainPage');
    anineFilter(type, value, name);
  },
  
}).resolve();

