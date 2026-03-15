import {html, api, c} from '../data/config.js';
import {escHtml, router} from './mainLogic.js';


//рендер звичайних аніме
export async function renderGrid(list) {
  if (!list || list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  console.log('Ответ сервера:', list[0]);
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  list.forEach((anime, idx) => {
    //console.log('Ответ сервера:', a);
    const a = anime.release ? anime.release : anime;
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    card.onclick = () => {
      router.navigate(`/animeView/${a.id}`);
      //openTitle(a);
      //openTitle();
    };
    
    //const poster = `${api.imgApi + a.poster.optimized.src}`;
    const poster = `${api.imgApi + a.poster.optimized.thumbnail}`;
    const name = a.name.main;
    const year = a.year;
    const rating = a.age_rating.label;
    const type = a.type.description;
    const eps = a.episodes_total ? a.episodes_total : a.latest_episode?.ordinal;
    const genres = a.genres?.map(e => e.name).join(', ');
    
    card.innerHTML = `
      <img class="anime-card__poster img-blur" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="anime-card__poster-placeholder" style="display:${poster ? 'none' : 'flex'}">🎌</div>
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
        <div class="anime-card__meta">
          ${year ? `<span class="badge">${year}</span>` : ''}
          ${rating ? `<span class="badge badge--accent">${rating}</span>` : ''}
          ${type ? `<span class="badge badge--accent">${type}</span>` : ''}
          ${eps ? `<span class="badge badge--accent">${eps} еп.</span>` : ''}
          ${genres ? `<span class="badge badge--accent">${genres}</span>` : ''}
          
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  html.loader.innerHTML = '';
  html.loader.appendChild(grid);
  
  html.animeCardImg = c('anime-card__poster');
  
  html.animeCardImg.forEach((e, idx) => {
    e.onload = () => {
      const poster = `${api.imgApi + (list[idx].release ? list[idx].release.poster.optimized.src : list[idx].poster.optimized.src)}`;
      const imgLoader = new Image();
      imgLoader.src = poster;
      imgLoader.onload = () => {
        e.src = poster;
        e.classList.remove('img-blur');
      };
    };
  });
}


//рендер жанрів
export async function renderGenresGrid(list) {
  if (!list || list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  list.forEach((a, idx) => {
    //console.log('Відповідь сервера:', a);
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    /*card.onclick = () => {
      html.animeViewing.style.display = 'flex';
      html.mainPage.style.display = 'none';
      openTitle(a);
    };*/
    
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
  
  html.animeCardImg = c('anime-card__poster');
  
  html.animeCardImg.forEach((e, idx) => {
    e.onload = () => {
      const poster = `${api.imgApi + list[idx].image.optimized.preview}`;
      const imgLoader = new Image();
      imgLoader.src = poster;
      imgLoader.onload = () => {
        e.src = poster;
        e.classList.remove('img-blur');
      };
    };
  });
}

