import {html, api, c, vData, animeData} from '../data/config.js';
import {escHtml, router, apiFetch} from './main-logic.js';
import {filters} from './filter-anime.js';
import {videoConfigStart} from './page/anime-view.js';
import {paginCheck} from './paginations.js';


//рендер звичайних аніме
export async function renderGrid(list) {
  if (!list || list.data ? list.data.length === 0 : list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  videoConfigStart();
  
  const animeArray = list.data ? list.data : list;
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  html.loader.innerHTML = '';
  html.loader.appendChild(grid);
  
  renderAnimeGrid(animeArray, 'animeCard', grid);
  
  //pagination
  paginCheck(list);
}


//рендер жанрів
export async function renderGenresGrid(list) {
  if (!list || list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  videoConfigStart();
  
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  list.forEach((a, idx) => {
    const card = document.createElement('div');
    card.className = 'anime-card genre-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    
    const poster = `${api.imgApi + a.image.optimized.thumbnail}`;
    const name = a.name;
    
    card.innerHTML = `
      <img class="anime-card__poster img-blur" src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="anime-card__poster-placeholder" style="display:${poster ? 'none' : 'flex'}">🎌</div>
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  html.loader.innerHTML = '';
  html.loader.appendChild(grid);
  
  imgUpdate('animeCard', (idx) => list[idx].image.optimized.preview);
  
  //pagination
  paginCheck(list);
}


//img update
export function imgUpdate(type, getImgUrl) {
  html[animeData[type].img] = c(animeData[type].imgClass);
  
  html[animeData[type].img].forEach((e, idx) => {
    e.onload = () => {
      const imgUrl = getImgUrl(idx);
      if (!imgUrl) return;
      
      const poster = `${api.imgApi + imgUrl}`;
      const imgLoader = new Image();
      imgLoader.src = poster;
      imgLoader.onload = () => {
        e.src = poster;
        e.classList.remove('img-blur');
      };
    };
  });
}


//render list anime
export async function renderAnimeGrid(list, dataType, wrapAdd) {
  if (!list || list.data ? list.data.length === 0 : list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  
  const animeArray = list.data ? list.data : list;
  
  animeArray.forEach((anime, idx) => {
    const a = anime.release ? anime.release : anime;
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    card.onclick = () => {
      router.navigate(`/animeView/${a.id}`);
    };
    
    
    const poster = `${api.imgApi + a.poster.optimized.thumbnail}`;
    const name = a.name.main;
    const year = a.year;
    const rating = a.age_rating.label;
    const type = a.type.description;
    const eps = a.episodes_total ? a.episodes_total : a.latest_episode?.ordinal;
    const genres = a.genres?.map(e => e.name).join(', ');
    
    card.innerHTML = `
      <img class="${animeData[dataType].imgClass} img-blur" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="anime-card__poster-placeholder" style="display:${poster ? 'none' : 'flex'}">🎌</div>
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
        <div class="anime-card__meta">
          ${year ? `<span class="anime-info-text">${year}</span>` : ''}
          ${rating ? `<span class="anime-info-text accent">${rating}</span>` : ''}
          ${type ? `<span class="anime-info-text accent">${type}</span>` : ''}
          ${eps ? `<span class="anime-info-text accent">${eps} еп.</span>` : ''}
          ${genres ? `<span class="anime-info-text accent">${genres}</span>` : ''}
          
        </div>
      </div>
    `;
    
    wrapAdd ? wrapAdd.appendChild(card) : html[animeData[dataType].grid].appendChild(card);
  });
  
  imgUpdate(dataType, (idx) => (animeArray[idx].release ? animeArray[idx].release.poster.optimized.src : animeArray[idx].poster.optimized.src));
}


//start render anime
export function renderAnime(check, type, animes) {
  html[animeData[type].grid].innerHTML = '';
  if (check) {
    html[animeData[type].grid].classList.remove('no-grid');
    renderAnimeGrid(animes, type);
  } else {
    html[animeData[type].grid].classList.add('no-grid');
    html[animeData[type].grid].innerHTML = `<strong>${[animeData[type].text]}</strong>`;
  }
}

