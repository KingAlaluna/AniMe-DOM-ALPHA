import {html, api, data} from '../data/config.js';
import {escHtml, apiFetch, router} from './main-logic.js';
import {filters} from './filter-anime.js';
import {renderGrid, paginBtn} from './render-anime-lists.js';


let searchTimer;

html.searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = html.searchInput.value.trim();
  if (q.length < 2) {
    return;
  }
  searchTimer = setTimeout(() => {
    router.navigate(`/search/${q}`);
  }, 500);
});

html.searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { 
    html.searchInput.value = '';
  }
});



export async function searchAnime(query) {
  html.sectionTitle.innerHTML = `<em>Пошук:</em> ${escHtml(query)}`;
  data.currentTab = null;
  
  try {
    filters.config = {
      page: 1,
      'f[search]=': query,
    };
    
    api.active = `${api.catalog}?${new URLSearchParams(filters.config).toString()}`;
    const dataA = await apiFetch(api.active);
    
    
    if (!dataA || dataA.length === 0) {
      html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🔍</div><div class="empty-title">Нічого не знайдено </div><p>Попробуйте другий запит</p></div>';
    } else {
      paginBtn.status = false;
      renderGrid(dataA);
    }
  } catch (e) {
    showError('Помилка пошуку: ' + e.message);
    console.error('Помилка пошуку: ' + e.message);
  }
}
