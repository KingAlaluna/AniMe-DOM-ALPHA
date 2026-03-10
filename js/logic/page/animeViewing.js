async function openTitle(anime) {
  //console.log('клік по аніме', anime);
  
  html.episodesGrid.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
  
  try {
    const episodeId = anime.latest_episode.id;
    const episodes = await fetch(api.episodeApi + episodeId);
    const epsJson = await episodes.json();
    const eps = await epsJson.release.episodes;
    const a = await epsJson.release;
    
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
    
    
    // poster
    const poster = api.imgApi + a.poster.optimized.src;
    
    html.modalPoster.src = poster;
    html.modalTitle.textContent = a.name.main;
    
    // badges
    const badges = [];
    badges.push(a.year);
    if (title.status?.string) badges.push(title.status.string);
    if (title.type?.string) badges.push(title.type.string);
    (title.genres || []).slice(0, 3).forEach(g => badges.push(g));
    
    html.modalBadges.innerHTML = badges
      .map(b => `<span class="badge">${escHtml(b)}</span>`).join('');
    
    html.modalDesc.textContent = a.description || '';
    
    //if (eps.length > 0) playEpisode(eps[0]);
  
  
  } catch (e) {
    showError('Помилка завантаження тайтла: ' + e.message);
    console.log('Помилка завантаження тайтла: ' + e.message);
  }
}



function closeModal(event) {
  if (event && event.target !== html.animeViewing) return;
  doClose();
}


function doClose() {
  html.animeViewing.style.display = 'none';
  html.mainPage.style.display = 'flex';
  
  html.videoPlayer.pause();
  html.videoPlayer.src = '';
  
  vData.quality = 480;
  vData.episode = 1;
}


html.html.addEventListener('keydown', e => {
  if (e.key === 'Escape') doClose();
});

// init
loadTab('updates');



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


