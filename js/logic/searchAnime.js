// --- SEARCH debounce ---
let searchTimer;

html.searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = html.searchInput.value.trim();
  if (q.length < 2) {
    if (!q) loadTab(data.currentTab);
    return;
  }
  searchTimer = setTimeout(() => searchAnime(q), 400);
});

html.searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { html.searchInput.value = ''; loadTab(currentTab); }
});



async function searchAnime(query) {
  html.sectionTitle.innerHTML = `Пошук: <em>${escHtml(query)}</em>`;
  setLoading();
  try {
    const data = await apiFetch(`${api.search}${encodeURIComponent(query)}`);
    
    console.log('Пошук результат', data);
    
    if (!data || data.length === 0) {
      html.loader.innerHTML = '<div class="empty"><div class="empty-icon">🔍</div><div class="empty-title">Нічого не знайдено </div><p>Попробуйте другий запит</p></div>';
    } else {
      renderGrid(data);
    }
  } catch (e) {
    showError('Помилка пошуку: ' + e.message);
    console.log('Помилка пошуку: ' + e.message);
  }
}
