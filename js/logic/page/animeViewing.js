async function openTitle(idOrCode) {
  html.episodesGrid.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
  
  
  try {
    const episodes = await fetch(api.episodeApi + idOrCode.latest_episode.id);
    const epsJson = await episodes.json();
    const eps = await epsJson.release.episodes;
    const a = await epsJson.release;
    
    playEpisode(eps);
    videoQuality(eps);
    //html.videoPlayer.src = eps[0].hls_720;
    
    
    console.log('епизод 720', eps[0].hls_720);
    console.log('Загальні Дані епізодів:', epsJson);
    console.log('Дані епізодів:', eps);
    
    eps.forEach(e => {
      console.log('2 Дані епізода:', e);
    });
    renderEpisodes(eps);
    
    
    // poster
    const poster = api.imgApi + a.poster.optimized.src;
    //console.log('постер', poster);
    
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
    
    html.modalDesc.textContent = e.description || '';
    
    //if (eps.length > 0) playEpisode(eps[0]);
  
  
  } catch (e) {
    showError('Помилка завантаження тайтла: ' + e.message);
  }
}



function renderEpisodes(eps) {
  if (!eps.length) {
    html.episodesGrid.innerHTML = '<span style="color:var(--muted);font-size:0.8rem;">Эпизоды недоступны</span>';
    return;
  }
  
  html.episodesGrid.innerHTML = eps.map((ep, i) =>
    `<button class="ep-btn" id="ep_${i}" onclick="selectEpisode(${i})">${ep.episode || (i + 1)}</button>`
  ).join('');
}


function selectEpisode(idx) {
  const eps = currentTitle._epList;
  html.epBtn.forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('ep_' + idx);
  if (btn) btn.classList.add('active');
  playEpisode(eps[idx]);
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
  html.qualityBtn.forEach(e => {
    e.addEventListener('click', () => {
      const quality = e.dataset.quality;
      vData.quality = quality;
      playEpisode(url);
    });
  });
}



function playEpisode(ep) {
  const url = ep[vData.episode]['hls_' + vData.quality];
  
  if (vData.hls) {
    vData.hls.destroy(); 
    console.log('Старий потік знищено');
  }
  
  if (Hls.isSupported()) {
    vData.hls = new Hls({
      //debug: true,
      //enableWorker: true,
      //lowLatencyMode: true,
    });
    
    vData.hls.loadSource(url);
    vData.hls.attachMedia(html.videoPlayer);
    console.log('hls бібліотека успіх!');
    
    vData.hls.on(Hls.Events.ERROR, function (event, data) {
      /*console.group('!!! ДЕТАЛЬНАЯ ОШИБКА HLS !!!');
      console.error('Тип:', data.type);
      console.error('Детали:', data.details);
      console.error('Фатально:', data.fatal);
      if (data.response) {
        console.error('URL запроса:', data.response.url);
        console.error('Код ответа:', data.response.code);
        console.error('Текст ошибки:', data.response.text);
      }
      console.groupEnd();*/
    });
  } else {
    html.videoPlayer.src = url;
    console.log('hls працює без бібліотеки!');
  }
  
  
  //html.videoPlayer.src = ep[vData.episode]['hls_' + vData.quality];
  console.log('якість епізода', html.videoPlayer.src);
  console.log('url епізода', url);
}




  /*vData.hls.on(Hls.Events.ERROR, function (event, data) {
        console.group('!!! ДЕТАЛЬНАЯ ОШИБКА HLS !!!');
        console.error('Тип:', data.type);
        console.error('Детали:', data.details);
        console.error('Фатально:', data.fatal);
        if (data.response) {
            console.error('URL запроса:', data.response.url);
            console.error('Код ответа:', data.response.code);
            console.error('Текст ошибки:', data.response.text);
        }
        console.groupEnd();
    });

    // Лог переключения уровней качества
    vData.hls.on(Hls.Events.LEVEL_SWITCHING, (event, data) => {
        console.log('Переключение на уровень качества:', data.level);
    });*/