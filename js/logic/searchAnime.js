import {html, api, data} from '../data/config.js';
import {escHtml, apiFetch, router} from './mainLogic.js';
import {loadTab} from './filterAnime.js';
import {renderGrid} from './renderAnimeLists.js';


let searchTimer;

html.searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = html.searchInput.value.trim();
  if (q.length < 2) {
    //if (!q) loadTab(data.currentTab);
    return;
  }
  searchTimer = setTimeout(() => {
    //searchAnime(q);
    router.navigate(`/search/${q}`);
  }, 400);
});

html.searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { 
    html.searchInput.value = '';
    //loadTab(currentTab);
  }
});



export async function searchAnime(query) {
  html.sectionTitle.innerHTML = `<em>Пошук:</em> ${escHtml(query)}`;
  //setLoading();
  try {
    const dataA = await apiFetch(`${api.search}${encodeURIComponent(query)}`);
    console.log('Пошук результат', dataA);
    
    if (!dataA || dataA.length === 0) {
      html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🔍</div><div class="empty-title">Нічого не знайдено </div><p>Попробуйте другий запит</p></div>';
    } else {
      renderGrid(dataA);
    }
  } catch (e) {
    showError('Помилка пошуку: ' + e.message);
    console.log('Помилка пошуку: ' + e.message);
  }
}
