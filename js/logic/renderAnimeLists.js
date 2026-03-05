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
      html.animeViewing.style.display = 'flex';
      html.mainPage.style.display = 'none';
      openTitle(a);
    };
    
    const poster = `${api.imgApi + a.poster.optimized.src}`;
    const name = a.name.main;
    const year = a.year;
    const eps = a.player;
    
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



//рендер жанрів
async function renderGenresGrid(list) {
  if (!list || list.length === 0) {
    html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div><div class="empty-title">Пусто</div></div>';
    return;
  }
  
  const grid = document.createElement('div');
  grid.className = 'anime-grid';
  
  list.forEach((a, idx) => {
    console.log('Відповідь сервера:', a);
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    
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
    console.log('Ответ сервера:', a);
    
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${idx * 0.03}s`;
    
    card.onclick = () => {
      html.animeViewing.style.display = 'flex';
      html.mainPage.style.display = 'none';
      openTitle(a);
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

