import Hls from 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.mjs';
import Plyr from 'https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.mjs';

import {html, api, vData, data, c} from '../../data/config.js';


export async function openTitle(/*anime*/animeId) {
  //console.log('клік по аніме', anime);
  
  html.episodesGrid.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
  
  try {
    const id = animeId;
    
    const url = api.anime;
    const ad = await fetch(url + id);
    const d = await ad.json();
    const a = await d.data[0];
    const eps = a.episodes;
    
    console.log('Пошук аніме', d);
    //console.log('url пошука аніме', a);
    
    
    playEpisode(eps);
    renderEpisodes(eps);
    videoQuality(eps);
    videoEpisode(eps);
    
    /*console.log('Загальні Дані епізодів:', epsJson);
    console.log('Дані епізодів:', eps);
    
    eps.forEach(e => {
      console.log('2 Дані епізода:', e);
    });
    */
    //console.log(a)
    
    
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
      
      const poster = api.imgApi + e.image.optimized.preview;
      
      genre.innerHTML = `
        <img class="genre__img" src="${poster}" />
        <div class="genre__meta">
          <span class="badge badge--accent">${e.name}</span>
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
    html.description.addEventListener('click', () => {
      html.description.classList.toggle('active');
    });
    
  } catch (e) {
    //showError('Помилка завантаження тайтла: ' + e.message);
    console.log('Помилка завантаження тайтла: ' + e.message);
  }
}




//
//video quality
//
function videoQuality(url) {
  //plyr player
  const player = new Plyr(html.videoPlayer, {
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
    `<button class="episode-btn ${i == 0 ? 'active' : ''}" data-episode="${i}">${i + 1}</button>`
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

