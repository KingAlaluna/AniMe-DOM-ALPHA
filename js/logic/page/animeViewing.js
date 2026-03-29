import Hls from 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.mjs';
import Plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.mjs';

import {html, api, vData, data, c} from '../../data/config.js';
import {apiFetch, escHtml, router} from '../mainLogic.js';


export function videoConfigStart() {
  vData.episode = 0;
  vData.quality = '480';
  if (vData.hls) {
    vData.hls.destroy();
    vData.hls = null;
  }
}


export async function openTitle(animeId) {
  html.episodesGrid.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
  
  try {
    const d = await apiFetch(api.animeId + animeId);
    const a = await d.data[0];
    const eps = a.episodes;
    
    console.debug('Дивитись аніме', d);
    
    
    playEpisode(eps);
    renderEpisodes(eps);
    videoQuality(eps);
    videoEpisode(eps);
    
    
    // poster
    const poster = api.imgApi + a.poster.optimized.src;
    
    html.modalPoster.src = poster;
    html.modalTitle.textContent = a.name.main;
    html.titleEn.textContent = `(en: ${a.name.english})`;
    
    // badges
    const year = a.year;
    const rating = a.age_rating.label;
    const type = a.type.description;
    const episode = a?.episodes_total ? a?.episodes_total : a?.latest_episode?.ordinal;
    //const genres = anime.genres?.map(e => e.name).join(', ');
    
    html.genresPanel.innerHTML = '';
    
    a.genres?.forEach(e => {
      const genre = document.createElement('div');
      genre.className = 'genres-panel__genre';
      
      //const poster = api.imgApi + e.image.optimized.preview;
      const poster = api.imgApi + e.image.optimized.thumbnail;
      
      
      genre.innerHTML = `
        <img class="genre__img img-blur" src="${poster}" />
        <div class="genre__meta">
          <span class="meta__text-genre badge--accent">${e.name}</span>
        </div>
      `;
      
      html.genresPanel.appendChild(genre);
    });
    
    //console.log(genres);
    html.modalBadges.innerHTML = `
      ${year ? `<span class="badge">${year}</span>` : ''}
      ${rating ? `<span class="badge badge--accent">${rating}</span>` : ''}
      ${type ? `<span class="badge badge--accent">${type}</span>` : ''}
      ${episode ? `<span class="badge badge--accent">${episode} епізодів</span>` : ''}
    `;
    //${genres ? `<span class="badge badge--accent">${genres}</span>` : ''}
    
    
    html.description.textContent = a.description || '';
    
    
    html.genreImg = c('genre__img');
    
    html.genreImg.forEach((e, idx) => {
      e.onload = () => {
        const poster = `${api.imgApi + a.genres[idx].image.optimized.preview}`;
        const imgLoader = new Image();
        imgLoader.src = poster;
        imgLoader.onload = () => {
          e.src = poster;
          e.classList.remove('img-blur');
        };
      };
    });
    
    animeFranchises(animeId);
    const totalGenresName = a.genres.map(e => e.id).join(',');
    similarAnime(totalGenresName);
    animeMembers(a.members);
  } catch (e) {
    //showError('Помилка завантаження тайтла: ' + e.message);
    console.log('Помилка завантаження тайтла: ' + e.message);
  }
}

html.description.addEventListener('click', () => {
  html.description.classList.toggle('active');
});




//
//video quality
//
function videoQuality(url) {
  //plyr player
  vData.player = new Plyr(html.videoPlayer, {
    quality: {
      default: 480,
      options: [1080, 720, 480],
      forced: true,
      onChange: (newQuality) => {
        vData.quality = newQuality;
        playEpisode(url);
      },
    }
  });
}



function playEpisode(ep) {
  const url = ep[vData.episode]['hls_' + vData.quality];
  
  if (vData.hls) {
    vData.hls.destroy(); 
    console.log('Старий потік знищено');
  }
  
  if (Hls.isSupported()) {
    vData.hls = new Hls({});
    
    vData.hls.loadSource(url);
    vData.hls.attachMedia(html.videoPlayer);
    console.log('hls бібліотека успіх!');
  } else {
    html.videoPlayer.src = url;
    console.log('hls працює без бібліотеки!');
  }
}


//
//episode
//
function renderEpisodes(eps) {
  html.episodesGrid.innerHTML = eps.map((ep, i) =>
    `<button class="btn-number episode-btn ${i == 0 ? 'active' : ''}" data-episode="${i}">${i + 1}</button>`
  ).join('');
  html.episodeBtn = c('episode-btn');
}


function videoEpisode(url) {
  html.episodeBtn.forEach(e => {
    e.addEventListener('click', () => {
      html.episodeBtn.forEach(e => {
        e.classList.remove('active');
      });
      
      e.classList.add('active');
      //console.log('клік на епізод');
      
      const episode = e.dataset.episode;
      vData.episode = episode;
      playEpisode(url);
    });
  });
}



//
//anime franchises grid
//
async function animeFranchises(animeId) {
  try {
    const animes = await apiFetch(api.franchises + animeId);
    console.debug('Франшизи дані', animes);
    const releases = await animes[0]?.franchise_releases;
    console.debug('Франшизи реліз', releases);
    
    html.franchisesGrid.innerHTML = '';
    if (releases) {
      renderFranchisesGrid(releases);
    } else {
      html.franchisesGrid.innerHTML = 'Нажаль, в даного аніме франшизи відсутні...';
    }
  } catch (e) {
    console.error('Помилка завантаження франшиз', e.message);
  }
}


//render franchises anime
async function renderFranchisesGrid(list) {
  if (!list || list.data ? list.data.length === 0 : list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  //console.log('Ответ сервера:', list[0]);
  
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
      <img class="anime-franchises__poster img-blur" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
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
    
    html.franchisesGrid.appendChild(card);
  });
  
  
  html.animeFranchisesImg = c('anime-franchises__poster');
  
  html.animeFranchisesImg.forEach((e, idx) => {
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
}



//
//similar anime
//
async function similarAnime(genres) {
  try {
    console.debug('похожі аніме жанри', genres);
    const animes = await apiFetch(`${api.activeSimilar}?f[genres]=${genres}`);
    console.debug('похожі аніме сервер', animes);
    
    html.similarGrid.innerHTML = '';
    if (animes.data.length > 0) {
      renderSimilarGrid(animes);
    } else {
      html.similarGrid.innerHTML = 'Нажаль, аніме похожі за жанрами відсутні...';
    }
  } catch (e) {
    console.error('Помилка similarAnime', e.message);
  }
}



//render similar anime
async function renderSimilarGrid(list) {
  if (!list || list.data ? list.data.length === 0 : list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  //console.log('Ответ сервера:', list[0]);
  
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
      <img class="anime-similar__poster img-blur" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
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
    
    html.similarGrid.appendChild(card);
  });
  
  
  html.animeSimilarImg = c('anime-similar__poster');
  
  html.animeSimilarImg.forEach((e, idx) => {
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
}



//
//members (actors) anime
//
async function animeMembers(members) {
  try {
    console.log('members', members);
    
    html.membersGrid.innerHTML = '';
    if (members.length > 0) {
      renderMembersGrid(members);
    } else {
      html.membersGrid.innerHTML = 'Нажаль, акторів/актрис данного аніме не знайдено...';
    }
  } catch (e) {
    console.error('Помилка animeMembers', e.message);
  }
}


//render members anime
async function renderMembersGrid(list) {
  list.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    
    const avatar = m.user?.avatar?.optimized?.thumbnail ? api.imgApi + m.user?.avatar?.optimized?.thumbnail : null;
    const name = m.nickname;
    const role = m.role.description;
    const bgColor = noImgColor(name);
    
    card.innerHTML = `
      ${avatar ? `
        <img class="anime-member__img img-blur" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} src="${avatar}" alt="${escHtml(name)}">
      ` : `
        <div class="anime-no-img" style="background: ${bgColor}"></div>
      `}
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
        <div class="anime-card__meta">
          ${role ? `<span class="badge badge--accent">${role}</span>` : ''}
        </div>
      </div>
    `;
    
    html.membersGrid.appendChild(card);
  });
  
  
  html.animeMemberImg = c('anime-member__img');
  
  html.animeMemberImg.forEach((e, idx) => {
    e.onload = () => {
      const avatar = `${api.imgApi + (list[idx].user?.avatar?.optimized?.preview)}`;
      const imgLoader = new Image();
      imgLoader.src = avatar;
      imgLoader.onload = () => {
        e.src = avatar;
        e.classList.remove('img-blur');
      };
    };
  });
}




function noImgColor(name) {
  let hash = 0;
  
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  
  return `hsla(${hue}, 100%, var(--brightness), 1)`;
}
