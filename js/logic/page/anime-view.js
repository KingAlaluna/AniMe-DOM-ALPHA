import Hls from 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.mjs';
import Plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.mjs';

import {html, api, vData, data, c, animeData} from '../../data/config.js';
import {apiFetch, escHtml, router} from '../main-logic.js';
import {imgUpdate, renderAnimeGrid, renderAnime} from '../render-anime-lists.js';


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
    
    
    if (eps[0]?.hls_480 || eps[0]?.hls_720 || eps[0]?.hls_1080) {
      html.episodesGrid.classList.remove('no-episodes');
      playEpisode(eps);
      renderEpisodes(eps);
      videoQuality(eps);
      videoEpisode(eps);
    } else {
      html.episodesGrid.classList.add('no-episodes');
      html.episodesGrid.innerHTML = '<strong>Нажаль, посилань на епізоди данного аніме не існує...</strong>';
    }
    
    
    // poster
    const poster = api.imgApi + a.poster.optimized.src;
    
    html.animeViewAnimePoster.src = poster;
    html.animeViewTitle.textContent = a.name.main;
    html.animeViewTitleEn.textContent = `(en: ${a.name.english})`;
    
    // badges
    const year = a.year;
    const rating = a.age_rating.label;
    const type = a.type.description;
    const episode = a?.episodes_total ? a?.episodes_total : a?.latest_episode?.ordinal;
    
    html.animeViewGenresPanel.innerHTML = '';
    
    a.genres?.forEach(e => {
      const genre = document.createElement('div');
      genre.className = 'genre-card';
      
      const poster = api.imgApi + e.image.optimized.thumbnail;
      
      
      genre.innerHTML = `
        <img class="genre__img img-blur" src="${poster}" />
        <div class="genre__meta">
          <span class="anime-info-text genre accent">${e.name}</span>
        </div>
      `;
      
      html.animeViewGenresPanel.appendChild(genre);
    });
    
    html.animeViewInfoWrap.innerHTML = `
      ${year ? `<span class="anime-info-text">${year}</span>` : ''}
      ${rating ? `<span class="anime-info-text accent">${rating}</span>` : ''}
      ${type ? `<span class="anime-info-text accent">${type}</span>` : ''}
      ${episode ? `<span class="anime-info-text accent">${episode} епізодів</span>` : ''}
    `;
    
    
    html.animeViewDescription.textContent = a.description || '';
    
    imgUpdate('genre', (idx) => a.genres[idx].image.optimized.preview);
    
    animeFranchises(animeId);
    const totalGenresName = a.genres.map(e => e.id).join(',');
    similarAnime(totalGenresName);
    animeMembers(a.members);
    
    if (!data.descriptionActive) {
      data.descriptionActive = true;
      html.animeViewDescription.addEventListener('click', () => {
        html.animeViewDescription.classList.toggle('active');
      });
    }
  } catch (e) {
    console.error('Помилка завантаження тайтла: ' + e);
  }
}



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
  
  if (!url) {
    return;
  }
  
  if (vData.hls) {
    vData.hls.destroy(); 
  }
  
  if (Hls.isSupported()) {
    vData.hls = new Hls({});
    
    vData.hls.loadSource(url);
    vData.hls.attachMedia(html.videoPlayer);
  } else {
    html.videoPlayer.src = url;
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
    const releases = await animes[0]?.franchise_releases;
    
    renderAnime(releases, 'franchises', releases);
  } catch (e) {
    console.error('Помилка завантаження франшиз', e.message);
  }
}


//
//similar anime
//
async function similarAnime(genres) {
  try {
    const animes = await apiFetch(`${api.activeSimilar}?f[genres]=${genres}`);
    
    renderAnime(animes.data.length > 0, 'similar', animes);
  } catch (e) {
    console.error('Помилка similarAnime', e.message);
  }
}


//
//members (actors) anime
//
async function animeMembers(members) {
  try {
    html.membersGrid.innerHTML = '';
    if (members.length > 0) {
      html.membersGrid.classList.remove('no-grid');
      renderMembersGrid(members);
    } else {
      html.membersGrid.classList.add('no-grid');
      html.membersGrid.innerHTML = '<strong>Нажаль, акторів/актрис данного аніме не знайдено...</strong>';
    }
  } catch (e) {
    console.error('Помилка animeMembers', e.message);
  }
}


//render members anime
async function renderMembersGrid(list) {
  list.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'anime-card member-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    
    const avatar = m.user?.avatar?.optimized?.thumbnail ? api.imgApi + m.user?.avatar?.optimized?.thumbnail : null;
    const name = m.nickname;
    const role = m.role.description;
    const bgColor = noImgColor(name);
    
    card.innerHTML = `
      ${avatar ? `
        <img class="anime-member__img img-blur" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} src="${avatar}" alt="${escHtml(name)}">
      ` : `
        <div class="anime-member__img anime-no-img" style="background: ${bgColor}"></div>
      `}
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
        <div class="anime-card__meta">
          ${role ? `<span class="anime-info-text accent">${role}</span>` : ''}
        </div>
      </div>
    `;
    
    html.membersGrid.appendChild(card);
  });
  
  imgUpdate('member', (idx) => list[idx].user?.avatar?.optimized?.preview);
}




function noImgColor(name) {
  let hash = 0;
  
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  
  return `hsla(${hue}, 100%, var(--brightness), 1)`;
}

