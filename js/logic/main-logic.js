//lib
import * as NavigoLib from 'https://esm.sh/navigo';

//import elemetns
import {html, api, data, i} from '../data/config.js';
import {btnMapValue} from '../data/filter.js';
import {openTitle, videoConfigStart} from './page/anime-view.js';
import {loadTab, anineFilter} from './filter-anime.js';
import {searchAnime} from './search-anime.js';

//no elements import
import './menu.js';
import './render-anime-lists.js';
import '../../sw-init.js';
import './theme.js';


// add id pages
function idMainPage() {
  html.pagin = i('pagin');
  html.loader = i('loader');
  html.sectionTitle = i('section-title');
}

function idAnimeView() {
  html.animeViewAnimePoster = i('anime-view-anime-poster');
  html.animeViewTitle = i('anime-view-title');
  html.animeViewInfoWrap = i('anime-view-info-wrap');
  html.animeViewDescription = i('anime-view-description');
  html.animeViewTitleEn = i('anime-view-title-en');
  html.animeViewGenresPanel = i('anime-view-genres-panel');
  html.episodesGrid = i('episodes-grid');
  html.videoPlayer = i('video-player');
  html.franchisesGrid = i('franchises-grid');
  html.similarGrid = i('similar-grid');
  html.membersGrid = i('members-grid');
}

const newIdPage = {
  'main-page': idMainPage,
  'anime-view': idAnimeView,
};

function pageActive(page) {
  if (data.page != page) {
    data.page = page;
    if (page == 'main-page') {
      data.descriptionActive = false;
    }
    
    html.searchInput.value = '';
    
    html.templatesPages.forEach(e => {
      const dataPage = e.dataset.page;
      if (dataPage == page) {
        const content = e.content.cloneNode(true);
        html.tagMain.replaceChildren(content);
        newIdPage[page]();
      }
    });
  }
}


// api fetch helpes 
export async function apiFetch(endpoint) {
  const res = await fetch(endpoint || api.API);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}



// utils
export function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


async function scheduleNow(type) {
  if (Object.keys(data.scheduleNow).length == 0) {
    const result = await apiFetch(api.scheduleNow);
    data.scheduleNow = await result;
  }
  pageActive('main-page');
  loadTab(type);
}


function btnActive(match) {
  const name = match.route.handler.name;
  const type = match.data?.type;
  const value = match.data?.value;
  
  
  html.cMenuBtn.forEach(e => {
    const dataType = e.dataset.type;
    const dataFilter = e.dataset.filter;
    
    if (dataFilter && dataFilter != match.url) {
      e.classList.remove('active');
    }
    
    if (name == '/') {
      if (dataFilter == 'main') {
        e.classList.add('active');
      }
    }
    
    
    if (dataFilter == match.url) {
      e.classList.add('active');
    }
    
    if (name == '/filters/:type/:value') {
      if (type && value && dataType == type && dataFilter == value) {
        e.classList.add('active');
      }
    }
  });
}




//
//router
//
const root = window.location.pathname;
export const router = new NavigoLib.default(root, { hash: true });

router.hooks({
  after: (match) => {
    videoConfigStart();
    btnActive(match);
  }
});

router.on({
  '/': () => {
    pageActive('main-page');
    loadTab('main');
  },
  
  '/search/:name': (match) => {
    pageActive('main-page');
    searchAnime(match.data.name);
  },
  
  '/animeView/:id': (match) => {
    pageActive('anime-view');
    openTitle(match.data.id);
  },
  
  
  '/updates': () => {
    pageActive('main-page');
    loadTab('updates');
  },
  
  //жанри 
  '/genres-random': () => {
    pageActive('main-page');
    loadTab('genres-random');
  },
  
  '/genres-all': () => {
    pageActive('main-page');
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
    pageActive('main-page');
    loadTab('scheduleWeek');
  },
  
  
  //filters
  '/filters/:type/:value': (match) => {
    const type = match.data.type;
    const value = match.data.value;
    const name = type != 'years' ? btnMapValue[type].get(isNaN(value) ? value : Number(value)) : null;
    
    pageActive('main-page');
    anineFilter(type, value, name);
  },
  
}).resolve();

