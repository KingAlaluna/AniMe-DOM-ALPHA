//рендер звичайних аніме
async function renderGrid(list) {
  if (!list || list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  list.forEach((a, idx) => {
    console.log('Ответ сервера:', a);
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    card.onclick = () => {
      router.navigate('/animeView');
      openTitle(a);
    };
    
    //const poster = `${api.imgApi + a.poster.optimized.src}`;
    const poster = `${api.imgApi + a.poster.optimized.thumbnail}`;
    const name = a.name.main;
    const year = a.year;
    const rating = a.age_rating.label;
    const type = a.type.description;
    const eps = a.episodes_total ? a.episodes_total : a.latest_episode.ordinal;
    const genres = a.genres?.map(e => e.name).join(', ');
    
    card.innerHTML = `
      <img class="anime-card__poster img-blur" loading="lazy" src="${poster}" alt="${escHtml(name)}" ${idx < 6 ? 'fetchpriority="high"' : ''} ${idx > 5 ? 'loading="lazy"' : ''} onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
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
      const poster = `${api.imgApi + list[idx].poster.optimized.src}`;
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
async function renderGenresGrid(list) {
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
    
    const poster = `${api.imgApi + a.image.optimized.preview}`;
    const name = a.name;
    
    card.innerHTML = `
      <img class="anime-card__poster" src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="anime-card__poster-placeholder" style="display:${poster ? 'none' : 'flex'}">🎌</div>
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  html.loader.innerHTML = '';
  html.loader.appendChild(grid);
}



//рендер релізів, графіків аніме
async function renderReleaseGrid(list) {
  if (!list || list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  list.forEach((a, idx) => {
    //console.log('Ответ сервера:', a);
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    card.onclick = () => {
      router.navigate('/animeView');
      openTitle(a.release);
    };
    
    const poster = `${api.imgApi + a.release.poster.optimized.src}`;
    const name = a.release.name.main;
    const year = a.release.year;
    const eps = a.release.player;
    
    card.innerHTML = `
      <img class="anime-card__poster" src="${poster}" alt="${escHtml(name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="anime-card__poster-placeholder" style="display:${poster ? 'none' : 'flex'}">🎌</div>
      <div class="anime-card__body">
        <div class="anime-card__title">${escHtml(name)}</div>
        <div class="anime-card__meta">
          ${year ? `<span class="badge">${year}</span>` : ''}
          ${eps ? `<span class="badge badge--accent">${eps} эп.</span>` : ''}
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  html.loader.innerHTML = '';
  html.loader.appendChild(grid);
}

