import {html, api, c, vData} from '../data/config.js';
import {escHtml, router, apiFetch} from './mainLogic.js';
import {filters} from './filterAnime.js';
import {videoConfigStart} from './page/animeViewing.js';

export const paginBtn = {
  status: false,
};


//рендер звичайних аніме
export async function renderGrid(list) {
  if (!list || list.data ? list.data.length === 0 : list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  //console.log('Ответ сервера:', list[0]);
  videoConfigStart();
  
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  const animeArray = list.data ? list.data : list;
  console.log('Ответ сервера:', animeArray[0]);
  
  animeArray.forEach((anime, idx) => {
    //console.log('Ответ сервера:', a);
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
      const poster = `${api.imgApi + (animeArray[idx].release ? animeArray[idx].release.poster.optimized.src : animeArray[idx].poster.optimized.src)}`;
      const imgLoader = new Image();
      imgLoader.src = poster;
      imgLoader.onload = () => {
        e.src = poster;
        e.classList.remove('img-blur');
      };
    };
  });
  
  
  //пагінація
  if (!paginBtn.status) {
    const pagesStatus = list?.meta?.pagination?.total_pages;
    const checkPagesTotal = pagesStatus ? pagesStatus : 1;
    const pagesTotal = Number(checkPagesTotal);
    paginBtnRender(pagesTotal, pagesStatus ? true : false);
    console.log('СТОРІНОК:' + pagesTotal);
  }
}



//
//пагінація
//
//шаблон
class PaginBtn {
  constructor(page) {
    this.btn = `<button class="btn-number pagin-btn ${page == 1 ? 'active' : ''}" data-page="${page}">${page}</button>`;
  }
}


//логіка 
function paginBtnRender(pagesTotal, pagesTotalStatus) {
  paginBtn.status = true;
  
  let btnPaginLeft = '';
  let btnPaginRight = '';
  let btn = 0;
  let btnMax = Math.ceil((pagesTotal / 2) > 8 ? 8 : pagesTotal / 2);
  
  while (btn < pagesTotal / 2 && btn < 8) {
    btnPaginLeft += new PaginBtn(btn + 1).btn;
    if (pagesTotal <= 15) {
      if (pagesTotal % 2 != 0) {
        btnPaginRight += btnMax < Math.ceil(pagesTotal / 2) ? new PaginBtn(pagesTotal - (btnMax - 1)).btn : '';
      } else {
        btnPaginRight += new PaginBtn(pagesTotal - (btnMax - 1)).btn;
      }
    } else {
      btnPaginRight += new PaginBtn(pagesTotal - (btnMax - 1)).btn;
    }
    
    btn += 1;
    btnMax -= 1;
  }
  
  
  html.pagin.innerHTML = `
    ${btnPaginLeft}
    ${(pagesTotal / 2) > 8 ? '<input class="btn-number pagin-btn" type="number" placeholder="Сторінка" />' : ''}
    ${btnPaginRight}
  `;
  
  if (!pagesTotalStatus) {
    return;
  }
  
  //click
  html.paginBtn = c('pagin-btn');
  
  html.paginBtn.forEach(e => {
    ['click', 'keydown'].forEach(ev => {
      e.addEventListener(ev, async (en) => {
        if (ev == 'click') {
          html.paginBtn.forEach(e => {
            e.classList.remove('active');
          });
          e.classList.add('active');
          
          const page = e.dataset.page;
          if (page) {
            filters.config.page = page;
            api.active = `${api.catalog}?${new URLSearchParams(filters.config).toString()}`;
            const newAnimes = await apiFetch(`${api.active}`);
            renderGrid(newAnimes);
            console.log('КЛІК НА КНОПКУ ПАГІНАЦІЇ!');
          }
        }
        if (ev == 'keydown' && en.key == 'Enter') {
          const page = e.dataset.page;
          if (!page) {
            console.log('КЛІК НА ЕНТЕР ПАГІНАЦІЇ!');
            if (e.value > 0 && e.value <= pagesTotal) {
              filters.config.page = e.value;
              api.active = `${api.catalog}?${new URLSearchParams(filters.config).toString()}`;
              const newAnimes = await apiFetch(`${api.active}`);
              renderGrid(newAnimes);
            } else {
              e.value = '';
              e.placeholder = 'Помилка!';
              e.classList.add('error');
              setTimeout(() => {
                e.placeholder = 'Сторінка';
                e.classList.remove('error');
              }, 1000);
            }
          }
        }
      });
    });
  });
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
    //console.log('Відповідь сервера:', a);
    
    const card = document.createElement('div');
    card.className = 'anime-card genre-card';
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

